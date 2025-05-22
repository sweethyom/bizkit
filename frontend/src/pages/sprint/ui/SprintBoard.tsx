import { useSprintBoardData } from '@/pages/sprint/model/useSprintBoardData';
import { useSprintBoardDrag } from '@/pages/sprint/model/useSprintBoardDrag';
import { useSprintBoardFilter } from '@/pages/sprint/model/useSprintBoardFilter';
import { Button } from '@/shared/ui';
import { IssueDetailModal, useIssueModalStore } from '@/widgets/issue-detail-modal';
import { DragDropContext } from '@hello-pangea/dnd';
import { Layers, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Issue, SprintData } from '../model/types';
import { SprintBoardBody } from './SprintBoardBody';
import { SprintBoardHeader } from './SprintBoardHeader';
import { SprintErrorState } from './SprintErrorState';
import { SprintFilterSection } from './SprintFilterSection';
import { SprintLoadingState } from './SprintLoadingState';

export const SprintBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // 스프린트 데이터 관리 훅
  const { sprintData, loading, error, updateIssue, deleteIssue, refreshData } =
    useSprintBoardData(projectId);

  // 스프린트 보드 데이터 상태 관리
  const [boardData, setBoardData] = useState<SprintData | null>(null);

  // sprintData가 변경되면 boardData 업데이트
  useEffect(() => {
    if (sprintData) {
      setBoardData(sprintData);
    }
  }, [sprintData]);

  // 필터링 관련 훅
  const {
    activeFilter,
    setActiveFilter,
    getFilterName,
    getTotalFilteredIssuesCount,
    getFilteredSprintData,
  } = useSprintBoardFilter(boardData || sprintData);

  // 드래그 앤 드롭 처리 훅
  const { onDragEnd } = useSprintBoardDrag(
    boardData, // 현재 화면에 표시된 데이터
    updateIssue, // 이슈 업데이트 콜백
    setBoardData, // 데이터 업데이트 함수
    projectId, // 프로젝트 ID
  );

  // 이슈 모달 스토어 사용
  const {
    openModal,
    closeModal,
    isOpen: isIssueModalOpen,
    issue: modalIssue,
  } = useIssueModalStore();

  // 모달에서 이슈 업데이트 감지 및 처리
  const prevIssueRef = useRef<Issue | null>(null);
  const isUpdatingRef = useRef(false);

  // 모달이 닫힐 때 isUpdatingRef 초기화
  useEffect(() => {
    if (!isIssueModalOpen) {
      isUpdatingRef.current = false;
    }
  }, [isIssueModalOpen]);

  useEffect(() => {
    // 현재 업데이트 중이면 무한 루프 방지
    if (isUpdatingRef.current) return;

    if (modalIssue && isIssueModalOpen) {
      // 이전 이슈와 현재 이슈를 비교하여 변경이 있을 때만 업데이트
      if (
        !prevIssueRef.current ||
        JSON.stringify(prevIssueRef.current) !== JSON.stringify(modalIssue)
      ) {
        console.log('이슈 업데이트 감지:', modalIssue.id, modalIssue.name);

        // 현재 이슈 상태 저장
        prevIssueRef.current = JSON.parse(JSON.stringify(modalIssue));

        // 업데이트 중 플래그 설정
        isUpdatingRef.current = true;

        try {
          // 스프린트 보드 형식에 맞게 이슈 변환
          const sprintBoardIssue: Issue = {
            ...(modalIssue as any),
            title: modalIssue.name || modalIssue.title || '',
          };

          // 보드 데이터 업데이트
          updateIssue(sprintBoardIssue as Issue);
          console.log('스프린트 보드에 이슈 업데이트 성공:', sprintBoardIssue.title);
        } finally {
          // 업데이트 완료 플래그 설정
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 0);
        }
      }
    } else if (!isIssueModalOpen) {
      // 모달이 닫혔을 때 ref 초기화
      prevIssueRef.current = null;
    }
  }, [modalIssue, isIssueModalOpen, updateIssue, refreshData]);

  // 이슈 클릭 핸들러
  const handleIssueClick = useCallback(
    (issue: Issue) => {
      console.log('이슈 클릭:', issue.id);
      // 참조 사비를 방지하기 위해 데이터 복사
      const issueCopy = JSON.parse(JSON.stringify(issue));
      openModal(issueCopy);
    },
    [openModal],
  );

  // 이슈 삭제 핸들러
  const handleDeleteIssue = useCallback(async () => {
    const issue = useIssueModalStore.getState().issue;
    if (issue) {
      try {
        await deleteIssue(issue.id);
        closeModal();
        // 삭제 후 데이터 새로고침
        refreshData();
      } catch (error) {
        console.error('이슈 삭제 오류:', error);
      }
    }
  }, [deleteIssue, closeModal, refreshData]);

  // 펼쳐진 컴포넌트 그룹 관리
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());

  // 컴포넌트 그룹 펼치기/접기 토글 핸들러
  const handleToggleExpand = useCallback((componentName: string) => {
    setExpandedComponents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(componentName)) {
        newSet.delete(componentName);
      } else {
        newSet.add(componentName);
      }
      return newSet;
    });
  }, []);

  // 초기 확장 상태 설정
  useEffect(() => {
    if (sprintData) {
      const initialExpandedComponents = new Set<string>();

      sprintData.statusGroups.forEach((statusGroup) => {
        statusGroup.componentGroups.forEach((componentGroup) => {
          if (componentGroup.isExpanded) {
            initialExpandedComponents.add(componentGroup.name);
          }
        });
      });

      setExpandedComponents(initialExpandedComponents);
    }
  }, [sprintData]);

  // 로딩 중 표시
  if (loading) {
    return <SprintLoadingState />;
  }

  // 에러 표시
  if (error) {
    return <SprintErrorState error={error} projectId={projectId} />;
  }

  // 데이터 없음 표시
  if (!sprintData) {
    return <SprintErrorState error='데이터를 불러올 수 없습니다' projectId={projectId} />;
  }

  // 표시할 데이터 결정
  const displayData = boardData || sprintData;
  const filteredData = getFilteredSprintData() || displayData;
  const filterName = getFilterName();
  const totalFilteredCount = getTotalFilteredIssuesCount();

  return (
    <div className='flex flex-col gap-4 transition-all duration-300'>
      {/* 헤더 */}
      <div className='rounded-lg border-none bg-white/60 shadow-md backdrop-blur-sm'>
        <div className='p-4'>
          <SprintBoardHeader
            activeFilter={activeFilter}
            filterName={filterName}
            totalFilteredCount={totalFilteredCount}
          />
        </div>
      </div>

      <section className='bg-background-primary flex flex-col gap-4 p-4'>
        {/* 필터 섹션 */}
        <div className='mb-4'>
          <SprintFilterSection
            sprintData={displayData}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            className='w-full'
          />
        </div>

        {/* 드래그 앤 드롭 컨텍스트 */}
        <DragDropContext onDragEnd={onDragEnd}>
          <SprintBoardBody
            sprintData={filteredData}
            onIssueClick={handleIssueClick}
            expandedComponents={expandedComponents}
            onToggleExpand={handleToggleExpand}
            filterActive={activeFilter !== null}
          />
        </DragDropContext>
      </section>

      {/* 이슈 상세 모달 */}
      {isIssueModalOpen && (
        <>
          <IssueDetailModal />
          {/* 삭제 버튼 */}
          <div className='fixed right-8 bottom-8 z-[60] transition-all duration-300'>
            <Button
              color='warning'
              variant='solid'
              onClick={handleDeleteIssue}
              className='flex items-center gap-2 rounded-full bg-red-600 px-5 py-6 text-white shadow-lg transition-all duration-200 hover:bg-red-700 hover:shadow-xl'
            >
              <X size={18} />
              <span>이슈 삭제</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

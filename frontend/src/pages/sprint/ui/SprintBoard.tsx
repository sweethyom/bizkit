import { useSprintBoardData } from '@/pages/sprint/model/useSprintBoardData';
import { useSprintBoardDrag } from '@/pages/sprint/model/useSprintBoardDrag';
import { useSprintBoardFilter } from '@/pages/sprint/model/useSprintBoardFilter';
import { DragDropContext } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Issue } from '../model/types';
import { SprintBoardBody } from './SprintBoardBody';
import { SprintBoardHeader } from './SprintBoardHeader';
import { SprintErrorState } from './SprintErrorState';
import { SprintFilterSection } from './SprintFilterSection';
import { SprintIssueDetailModal } from './SprintIssueDetailModal';
import { SprintLoadingState } from './SprintLoadingState';

export const SprintBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { sprintData, loading, error, updateIssue, deleteIssue, refreshData } =
    useSprintBoardData(projectId);

  const {
    activeFilter,
    setActiveFilter,
    getFilterName,
    getTotalFilteredIssuesCount,
    getFilteredSprintData,
  } = useSprintBoardFilter(sprintData);

  // React Hooks 규칙: 조건부로 Hook을 호출하면 안됨
  const { onDragEnd } = useSprintBoardDrag(
    sprintData,
    updateIssue,
    // refreshData는 함수를 직접 호출하는 것이므로, 함수를 호출하는 콜백 함수를 전달
    (newData) => {
      refreshData();
    },
    projectId,
  );

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 셀렉터 이벤트 핸들러
  const handleIssueClick = useCallback((issue: Issue) => {
    console.log('Issue clicked:', issue.id);
    setIsModalOpen(true);
    setSelectedIssue(issue);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  }, []);

  // 펼쳐진 컴포넌트 그룹 관리
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());

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

  if (loading) {
    return <SprintLoadingState />;
  }

  if (error) {
    return <SprintErrorState error={error} projectId={projectId} />;
  }

  if (!sprintData) {
    return <SprintErrorState error='데이터 없음' projectId={projectId} />;
  }

  const filteredData = getFilteredSprintData() || sprintData;
  const filterName = getFilterName();
  const totalFilteredCount = getTotalFilteredIssuesCount();

  return (
    <div className='flex flex-col gap-4'>
      <SprintBoardHeader
        activeFilter={activeFilter}
        filterName={filterName}
        totalFilteredCount={totalFilteredCount}
      />

      <section className='bg-background-primary flex flex-col gap-4 p-4'>
        <SprintFilterSection
          sprintData={sprintData}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

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

      <SprintIssueDetailModal
        isOpen={isModalOpen}
        selectedIssue={selectedIssue}
        onClose={handleCloseModal}
        onDelete={deleteIssue}
        onUpdate={updateIssue}
      />
    </div>
  );
};

import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { StatusColumn } from '@/pages/sprint/ui/StatusColumn';
import { IssueDetailModal } from '@/pages/sprint/ui/IssueDetailModal';
import {
  getSprintData,
  updateIssueStatus,
  updateIssueComponent,
  deleteIssue,
} from '@/pages/sprint/api/sprintApi';
import { SprintData, Issue } from '@/pages/sprint/model/types';
import { Users, Loader2, AlertCircle, LayoutGrid } from 'lucide-react';

export const SprintBoard: React.FC = () => {
  const [sprintData, setSprintData] = useState<SprintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSprintData();
        setSprintData(data);
      } catch (err) {
        setError('스프린트 데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  const handleUpdateIssue = (updatedIssue: Issue) => {
    if (!sprintData) return;

    // 스프린트 데이터에서 해당 이슈를 찾아 업데이트
    const updatedStatusGroups = sprintData.statusGroups.map((statusGroup) => {
      const updatedComponentGroups = statusGroup.componentGroups.map((componentGroup) => {
        const updatedIssues = componentGroup.issues.map((issue) => {
          if (issue.id === updatedIssue.id) {
            // 업데이트된 이슈 정보로 교체
            return updatedIssue;
          }
          return issue;
        });

        return {
          ...componentGroup,
          issues: updatedIssues,
        };
      });

      return {
        ...statusGroup,
        componentGroups: updatedComponentGroups,
      };
    });

    // 스프린트 데이터 업데이트
    setSprintData({
      ...sprintData,
      statusGroups: updatedStatusGroups,
    });
  };

  const handleDeleteIssue = async (issueId: string) => {
    if (!sprintData) return;

    try {
      // API 호출
      await deleteIssue(issueId);

      // 성공 시 UI 업데이트
      const updatedStatusGroups = sprintData.statusGroups.map((statusGroup) => {
        const updatedComponentGroups = statusGroup.componentGroups.map((componentGroup) => {
          return {
            ...componentGroup,
            issues: componentGroup.issues.filter((issue) => issue.id !== issueId),
          };
        });

        return {
          ...statusGroup,
          componentGroups: updatedComponentGroups,
        };
      });

      setSprintData({
        ...sprintData,
        statusGroups: updatedStatusGroups,
      });
    } catch (err) {
      console.error('이슈 삭제 실패:', err);
      // 필요한 경우 에러 처리 추가
    }
  };

  const handleToggleExpand = (statusGroupId: string, componentIdToToggle: string) => {
    if (!sprintData) return;

    const updatedStatusGroups = sprintData.statusGroups.map((statusGroup) => {
      if (statusGroup.id === statusGroupId) {
        const updatedComponentGroups = statusGroup.componentGroups.map((componentGroup) => {
          if (componentGroup.id === componentIdToToggle) {
            return {
              ...componentGroup,
              isExpanded: !componentGroup.isExpanded,
            };
          }
          return componentGroup; // 다른 컴포넌트 그룹은 그대로 반환
        });

        return {
          ...statusGroup,
          componentGroups: updatedComponentGroups, // 업데이트된 컴포넌트 그룹으로 교체
        };
      }
      return statusGroup; // 다른 상태 그룹은 그대로 반환
    });

    setSprintData({
      ...sprintData,
      statusGroups: updatedStatusGroups,
    });
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    // 드롭이 취소된 경우
    if (!destination) return;

    // 같은 위치에 드롭된 경우
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (type === 'ISSUE') {
      // 분석: source.droppableId 형식은 'statusId-componentId'
      const [sourceStatusId, sourceComponentId] = source.droppableId.split('-');
      const [destStatusId, destComponentId] = destination.droppableId.split('-');

      // 스프린트 데이터 복사
      const newSprintData = { ...sprintData! };

      // 소스 상태 그룹과 컴포넌트 그룹 찾기
      const sourceStatusGroup = newSprintData.statusGroups.find(
        (group) => group.id === sourceStatusId,
      )!;
      const sourceComponentGroup = sourceStatusGroup.componentGroups.find(
        (group) => group.id === sourceComponentId,
      )!;

      // 이슈 찾아서 제거
      const [movedIssue] = sourceComponentGroup.issues.splice(source.index, 1);

      // 목적지가 다른 상태로 이동한 경우 이슈 상태도 업데이트
      if (sourceStatusId !== destStatusId) {
        movedIssue.status = destStatusId as 'todo' | 'inProgress' | 'done';

        // API 호출
        try {
          await updateIssueStatus(movedIssue.id, movedIssue.status);
        } catch (err) {
          console.error('이슈 상태 업데이트 실패:', err);
          // 실패 시 UI 롤백 로직 추가 가능
        }
      }

      // 목적지가 다른 컴포넌트로 이동한 경우 컴포넌트도 업데이트
      if (sourceComponentId !== destComponentId) {
        movedIssue.component = destComponentId;

        // API 호출
        try {
          await updateIssueComponent(movedIssue.id, destComponentId);
        } catch (err) {
          console.error('이슈 컴포넌트 업데이트 실패:', err);
          // 실패 시 UI 롤백 로직 추가 가능
        }
      }

      // 목적지 상태 그룹과 컴포넌트 그룹 찾기
      const destStatusGroup = newSprintData.statusGroups.find(
        (group) => group.id === destStatusId,
      )!;
      const destComponentGroup = destStatusGroup.componentGroups.find(
        (group) => group.id === destComponentId,
      )!;

      // 목적지에 이슈 추가
      destComponentGroup.issues.splice(destination.index, 0, movedIssue);

      // 상태 업데이트
      setSprintData(newSprintData);
    }
  };

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <Loader2 className='w-12 h-12 text-blue-500 animate-spin mb-4' />
        <p className='text-lg font-medium text-gray-700'>스프린트 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
          <div className='flex items-center mb-4'>
            <AlertCircle className='w-8 h-8 text-red-500 mr-3' />
            <h2 className='text-xl font-semibold text-gray-800'>오류가 발생했습니다</h2>
          </div>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!sprintData) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
          <div className='flex items-center mb-4'>
            <AlertCircle className='w-8 h-8 text-yellow-500 mr-3' />
            <h2 className='text-xl font-semibold text-gray-800'>데이터 없음</h2>
          </div>
          <p className='text-gray-600 mb-4'>스프린트 데이터를 불러올 수 없습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 컴포넌트 목록 (중복 제거)
  const allComponents = Array.from(
    new Set(
      sprintData.statusGroups.flatMap((statusGroup) =>
        statusGroup.componentGroups.map((componentGroup) => componentGroup.name),
      ),
    ),
  );

  // 모든 이슈에서 담당자 목록 추출 (중복 제거)
  const allAssignees = Array.from(
    new Set(
      sprintData.statusGroups.flatMap((statusGroup) =>
        statusGroup.componentGroups.flatMap((componentGroup) =>
          componentGroup.issues.map((issue) => issue.assignee),
        ),
      ),
    ),
  ).filter(Boolean); // 빈 값 제거

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 헤더 */}
      <div className='bg-white shadow-sm py-4 px-6 mb-6'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-2xl font-bold text-gray-800'>스프린트 보드</h1>
          <p className='text-gray-500 mt-1'>작업 상태를 한눈에 파악하고 관리하세요</p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 pb-12'>
        {/* 필터 섹션 */}
        <div className='bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-x-8 gap-y-4'>
          {/* 컴포넌트 필터 */}
          <div className='flex items-center'>
            <LayoutGrid className='w-5 h-5 text-blue-500 mr-2' />
            <span className='text-sm font-medium text-gray-700 mr-3'>컴포넌트:</span>
            <div className='flex flex-wrap gap-2'>
              {allComponents.map((component, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeFilter === `component-${component}`
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  onClick={() =>
                    setActiveFilter(
                      activeFilter === `component-${component}` ? null : `component-${component}`,
                    )
                  }
                >
                  {component}
                </button>
              ))}
            </div>
          </div>

          {/* 담당자 필터 */}
          <div className='flex items-center'>
            <Users className='w-5 h-5 text-indigo-500 mr-2' />
            <span className='text-sm font-medium text-gray-700 mr-3'>담당자:</span>
            <div className='flex flex-wrap gap-2'>
              {allAssignees.map((assignee, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeFilter === `assignee-${assignee}`
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  onClick={() =>
                    setActiveFilter(
                      activeFilter === `assignee-${assignee}` ? null : `assignee-${assignee}`,
                    )
                  }
                >
                  {assignee}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 보드 섹션 */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {sprintData.statusGroups.map((statusGroup) => (
              <StatusColumn
                key={statusGroup.id}
                statusGroup={statusGroup}
                onToggleExpand={handleToggleExpand}
                onIssueClick={handleIssueClick}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* 이슈 상세 모달 */}
      <IssueDetailModal
        isOpen={isModalOpen}
        issue={selectedIssue}
        onClose={handleCloseModal}
        onDelete={handleDeleteIssue}
        onUpdate={handleUpdateIssue}
      />
    </div>
  );
};

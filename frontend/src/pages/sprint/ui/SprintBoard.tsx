import {
  deleteIssue,
  getSprintData,
  updateIssueComponent,
  updateIssueStatus,
} from '@/pages/sprint/api/sprintApi';
import { Issue, SprintData } from '@/pages/sprint/model/types';
import { IssueDetailModal } from '@/pages/sprint/ui/IssueDetailModal';
import { StatusColumn } from '@/pages/sprint/ui/StatusColumn';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { AlertCircle, LayoutGrid, Loader2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const SprintBoard: React.FC = () => {
  const [sprintData, setSprintData] = useState<SprintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!projectId) {
          throw new Error('Project ID is missing');
        }
        
        // 프로젝트 ID를 localStorage에 저장 (IssueDetailModal에서 사용)
        localStorage.setItem('currentProjectId', projectId);
        
        const data = await getSprintData(undefined, projectId);
        setSprintData(data);
      } catch (err: any) {
        // 에러 메시지 파싱
        if (err?.message?.includes('No sprint found')) {
          setError('현재 프로젝트에 스프린트가 존재하지 않습니다. 스프린트를 먼저 생성해주세요.');
        } else {
          setError('스프린트 데이터를 불러오는 중 오류가 발생했습니다.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

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

  // 펼쳐진 컴포넌트 그룹 이름 관리
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());

  // 컴포넌트별 이슈 총 개수를 계산하는 함수
  const getComponentIssueCounts = () => {
    if (!sprintData) return {};

    const counts: { [key: string]: number } = {};

    // 각 컴포넌트별로 해당 컴포넌트 이름을 키로 하는 이슈 개수 계산
    sprintData.statusGroups.forEach((statusGroup) => {
      statusGroup.componentGroups.forEach((componentGroup) => {
        if (!counts[componentGroup.name]) {
          counts[componentGroup.name] = 0;
        }
        counts[componentGroup.name] = Math.max(
          counts[componentGroup.name],
          componentGroup.issues.length,
        );
      });
    });

    return counts;
  };

  // 각 컴포넌트 이름별 이슈 총 개수
  const componentIssueCounts = getComponentIssueCounts();

  const handleToggleExpand = (componentName: string) => {
    setExpandedComponents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(componentName)) {
        newSet.delete(componentName);
      } else {
        newSet.add(componentName);
      }
      return newSet;
    });
  };

  // 필터 초기화 시 모든 컴포넌트 그룹도 초기 상태로 돌리기
  useEffect(() => {
    if (!activeFilter && sprintData) {
      // 필터가 없을 때 mock 데이터의 초기 상태로 돌리기
      // 명시적으로 expanded=true로 설정된 컴포넌트만 확장
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
  }, [activeFilter, sprintData]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    // 드롭이 취소된 경우
    if (!destination) return;

    // 같은 위치에 드롭된 경우
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (type === 'ISSUE' && sprintData) {
      try {
        // 분석: source.droppableId 형식은 'statusId-componentId'
        const [sourceStatusId, sourceComponentId] = source.droppableId.split('-');
        const [destStatusId, destComponentId] = destination.droppableId.split('-');

        // 스프린트 데이터 복사
        const newSprintData = { ...sprintData };

        // 소스 상태 그룹과 컴포넌트 그룹 찾기
        const sourceStatusGroup = newSprintData.statusGroups.find(
          (group) => group.id === sourceStatusId
        );
        
        if (!sourceStatusGroup) {
          console.error(`Status group not found: ${sourceStatusId}`);
          return;
        }
        
        const sourceComponentGroup = sourceStatusGroup.componentGroups.find(
          (group) => group.id === sourceComponentId
        );
        
        if (!sourceComponentGroup) {
          console.error(`Component group not found in source: ${sourceComponentId}`);
          return;
        }
        
        if (!sourceComponentGroup.issues || !Array.isArray(sourceComponentGroup.issues)) {
          console.error('Source component group has no issues array:', sourceComponentGroup);
          return;
        }

        // 이슈 찾아서 제거
        if (source.index >= sourceComponentGroup.issues.length) {
          console.error(`Invalid source index: ${source.index}, issues length: ${sourceComponentGroup.issues.length}`);
          return;
        }
        
        const [movedIssue] = sourceComponentGroup.issues.splice(source.index, 1);
        
        if (!movedIssue) {
          console.error('Failed to extract moved issue');
          return;
        }

        // 목적지가 다른 상태로 이동한 경우 이슈 상태도 업데이트
        if (sourceStatusId !== destStatusId) {
          movedIssue.status = destStatusId as 'todo' | 'inProgress' | 'done';

          // API 호출
          try {
            await updateIssueStatus(movedIssue.id, movedIssue.status);
          } catch (err) {
            console.error('이슈 상태 업데이트 실패:', err);
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
          }
        }

        // 목적지 상태 그룹과 컴포넌트 그룹 찾기
        const destStatusGroup = newSprintData.statusGroups.find(
          (group) => group.id === destStatusId
        );
        
        if (!destStatusGroup) {
          console.error(`Destination status group not found: ${destStatusId}`);
          return;
        }
        
        const destComponentGroup = destStatusGroup.componentGroups.find(
          (group) => group.id === destComponentId
        );
        
        if (!destComponentGroup) {
          console.error(`Destination component group not found: ${destComponentId}`);
          return;
        }
        
        if (!destComponentGroup.issues || !Array.isArray(destComponentGroup.issues)) {
          console.error('Destination component group has no issues array:', destComponentGroup);
          destComponentGroup.issues = [];
        }
        
        // 목적지에 이슈 추가
        destComponentGroup.issues.splice(destination.index, 0, movedIssue);

        // 상태 업데이트
        setSprintData(newSprintData);
      } catch (error) {
        console.error('드래그 앤 드롭 처리 중 오류 발생:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
        <Loader2 className='mb-4 h-12 w-12 animate-spin text-blue-500' />
        <p className='text-lg font-medium text-gray-700'>스프린트 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
        <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
          <div className='mb-4 flex items-center'>
            <AlertCircle className='mr-3 h-8 w-8 text-red-500' />
            <h2 className='text-xl font-semibold text-gray-800'>오류가 발생했습니다</h2>
          </div>
          <p className='mb-6 text-gray-600'>{error}</p>
          <div className='flex flex-col space-y-3'>
            {error.includes('스프린트가 존재하지 않습니다') && (
              <button
                onClick={() => {
                  // 스프린트 생성 페이지로 이동 (URL은 프로젝트에 맞게 수정 필요)
                  window.location.href = `/projects/${projectId}/sprint/create`;
                }}
                className='w-full rounded-md bg-blue-500 py-2 font-medium text-white transition-colors hover:bg-blue-600'
              >
                스프린트 생성하기
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className={`w-full rounded-md py-2 font-medium transition-colors ${error.includes('스프린트가 존재하지 않습니다') ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!sprintData) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
        <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
          <div className='mb-4 flex items-center'>
            <AlertCircle className='mr-3 h-8 w-8 text-yellow-500' />
            <h2 className='text-xl font-semibold text-gray-800'>데이터 없음</h2>
          </div>
          <p className='mb-4 text-gray-600'>스프린트 데이터를 불러올 수 없습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className='w-full rounded-md bg-blue-500 py-2 font-medium text-white transition-colors hover:bg-blue-600'
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

  // 필터링된 이슈 총 개수 계산
  const getTotalFilteredIssuesCount = () => {
    if (!sprintData || !activeFilter) return 0;

    let count = 0;
    sprintData.statusGroups.forEach((statusGroup) => {
      statusGroup.componentGroups.forEach((componentGroup) => {
        if (activeFilter.startsWith('component-')) {
          const filterComponent = activeFilter.replace('component-', '');
          if (componentGroup.name === filterComponent) {
            count += componentGroup.issues.length;
          }
        } else if (activeFilter.startsWith('assignee-')) {
          const filterAssignee = activeFilter.replace('assignee-', '');
          count += componentGroup.issues.filter(
            (issue) => issue.assignee === filterAssignee,
          ).length;
        }
      });
    });

    return count;
  };

  // 필터 이름 추출
  const getFilterName = () => {
    if (!activeFilter) return null;

    if (activeFilter.startsWith('component-')) {
      return `컴포넌트: ${activeFilter.replace('component-', '')}`;
    } else if (activeFilter.startsWith('assignee-')) {
      return `담당자: ${activeFilter.replace('assignee-', '')}`;
    }
    return null;
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 헤더 */}
      <div className='mb-6 bg-white px-6 py-4 shadow-sm'>
        <div className='mx-auto max-w-7xl'>
          <h1 className='text-2xl font-bold text-gray-800'>스프린트 보드</h1>
          <p className='mt-1 text-gray-500'>작업 상태를 한눈에 파악하고 관리하세요</p>
          {activeFilter && (
            <div className='mt-2 flex items-center'>
              <span className='mr-2 text-sm text-gray-600'>필터링 중:</span>
              <span className='inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800'>
                {getFilterName()} ({getTotalFilteredIssuesCount()}개 이슈)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 pb-12 sm:px-6'>
        {/* 필터 섹션 */}
        <div className='mb-6 flex flex-wrap gap-x-8 gap-y-4 rounded-lg bg-white p-4 shadow-sm'>
          {/* 컴포넌트 필터 */}
          <div className='flex items-center'>
            <LayoutGrid className='mr-2 h-5 w-5 text-blue-500' />
            <span className='mr-3 text-sm font-medium text-gray-700'>컴포넌트:</span>
            <div className='flex flex-wrap gap-2'>
              {allComponents.map((component, index) => (
                <button
                  key={index}
                  className={`rounded-full px-3 py-1 text-sm font-medium ${activeFilter === `component-${component}`
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
            <Users className='mr-2 h-5 w-5 text-indigo-500' />
            <span className='mr-3 text-sm font-medium text-gray-700'>담당자:</span>
            <div className='flex flex-wrap gap-2'>
              {allAssignees.map((assignee, index) => (
                <button
                  key={index}
                  className={`rounded-full px-3 py-1 text-sm font-medium ${activeFilter === `assignee-${assignee}`
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

          {/* 필터 초기화 버튼 */}
          {activeFilter && (
            <button
              className='ml-auto flex items-center rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300'
              onClick={() => setActiveFilter(null)}
            >
              필터 초기화
              <span className='ml-1'>×</span>
            </button>
          )}
        </div>

        {/* 보드 섹션 */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {sprintData.statusGroups.map((statusGroup) => {
              // 상태 그룹의 모든 컴포넌트 그룹에 대한 필터링된 사본 생성
              const filteredComponentGroups = statusGroup.componentGroups.map((componentGroup) => {
                // 컴포넌트 필터가 활성화된 경우
                if (activeFilter?.startsWith('component-')) {
                  const filterComponent = activeFilter.replace('component-', '');
                  // 컴포넌트 이름이 필터와 일치하지 않으면 빈 이슈 배열 반환
                  if (componentGroup.name !== filterComponent) {
                    return { ...componentGroup, issues: [] };
                  }
                }

                // 담당자 필터가 활성화된 경우
                if (activeFilter?.startsWith('assignee-')) {
                  const filterAssignee = activeFilter.replace('assignee-', '');
                  // 이슈 중 담당자가 필터와 일치하는 것만 유지
                  return {
                    ...componentGroup,
                    issues: componentGroup.issues.filter(
                      (issue) => issue.assignee === filterAssignee,
                    ),
                  };
                }

                // 필터가 없으면 원래 컴포넌트 그룹 반환
                return componentGroup;
              });

              // 필터링된 컴포넌트 그룹으로 상태 그룹 복사본 생성
              const filteredStatusGroup = {
                ...statusGroup,
                componentGroups: filteredComponentGroups,
              };

              return (
                <StatusColumn
                  key={statusGroup.id}
                  statusGroup={filteredStatusGroup}
                  onToggleExpand={handleToggleExpand}
                  expandedComponents={expandedComponents}
                  onIssueClick={handleIssueClick}
                  filterActive={activeFilter !== null}
                  componentIssueCounts={componentIssueCounts}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* 이슈 상세 모달 */}
      <IssueDetailModal
        isOpen={isModalOpen}
        issue={selectedIssue}
        projectId={projectId || ''}
        onClose={handleCloseModal}
        onDelete={handleDeleteIssue}
        onUpdate={handleUpdateIssue}
      />
    </div>
  );
};

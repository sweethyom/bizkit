import {
  deleteIssue,
  getSprintData,
  getOngoingSprintComponentIssues,
  updateIssueComponent,
  updateIssueStatus,
} from '@/pages/sprint/api/sprintApi';
import { Issue, SprintData } from '@/pages/sprint/model/types';
import { SprintIssueDetailModal } from '@/pages/sprint/ui/SprintIssueDetailModal';
import { StatusColumn } from '@/pages/sprint/ui/StatusColumn';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { AlertCircle, Filter, Loader2, Tag, Users, X } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
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

        console.log('Fetching ongoing sprint data for project:', projectId);
        
        // 활성 스프린트의 이슈 데이터를 컴포넌트별로 가져오기
        try {
          console.log('Trying to fetch ongoing sprint component issues API...');
          const componentIssueGroups = await getOngoingSprintComponentIssues();
          console.log('Received ongoing sprint component issues:', componentIssueGroups);
          
          // 받은 데이터를 SprintData 형식으로 변환
          // ... 기존 변환 로직 ... 

          if (componentIssueGroups && componentIssueGroups.length > 0) {
            // 데이터가 정상적으로 있는 경우
            const convertedData: SprintData = {
              statusGroups: [
                {
                  id: 'todo',
                  status: 'todo',
                  title: '해야 할 일',
                  componentGroups: [],
                },
                {
                  id: 'inProgress',
                  status: 'inProgress',
                  title: '진행 중',
                  componentGroups: [],
                },
                {
                  id: 'done',
                  status: 'done',
                  title: '완료',
                  componentGroups: [],
                },
              ],
            };

            // 모든 고유 컴포넌트 식별하기
            const allComponentsMap = new Map<string, string>();

            // API 응답에서 모든 고유 컴포넌트 추출
            componentIssueGroups.forEach(group => {
              group.issues.forEach(issue => {
                if (issue.component && typeof issue.component !== 'string') {
                  const componentId = issue.component.id.toString();
                  if (!allComponentsMap.has(componentId)) {
                    allComponentsMap.set(componentId, issue.component.name);
                  }
                }
              });
            });

            // 컴포넌트가 없는 경우를 위한 기본 컴포넌트 추가
            if (allComponentsMap.size === 0) {
              allComponentsMap.set('0', '미분류');
            }

            // 각 상태 그룹에 컴포넌트 그룹 초기화
            convertedData.statusGroups.forEach(statusGroup => {
              allComponentsMap.forEach((componentName, componentId) => {
                statusGroup.componentGroups.push({
                  id: componentId,
                  name: componentName,
                  isExpanded: true,
                  issues: [],
                });
              });
            });

            // 이슈를 적절한 상태 및 컴포넌트 그룹에 할당
            componentIssueGroups.forEach(group => {
              // issueStatus를 소문자 및 camelCase로 변환 (TODO -> todo, IN_PROGRESS -> inProgress)
              const statusKey = group.issueStatus === 'TODO' 
                ? 'todo' 
                : group.issueStatus === 'IN_PROGRESS' 
                  ? 'inProgress' 
                  : 'done';
              
              // 해당 상태 그룹 찾기
              const statusGroup = convertedData.statusGroups.find(sg => sg.status === statusKey);
              if (!statusGroup) return;

              // 각 이슈를 적절한 컴포넌트 그룹에 할당
              group.issues.forEach(issue => {
                let componentId = '0';
                if (issue.component) {
                  if (typeof issue.component !== 'string') {
                    componentId = issue.component.id.toString();
                  }
                }

                // 해당 컴포넌트 그룹 찾기
                const componentGroup = statusGroup.componentGroups.find(cg => cg.id === componentId);
                if (!componentGroup) return;

                // 이슈 객체 상태 표준화 (API 응답에서 프론트엔드 모델로 변환)
                const formattedIssue: Issue = {
                  id: issue.id.toString(),
                  key: issue.key,
                  title: issue.name || '',
                  epic: issue.epic ? (typeof issue.epic === 'string' ? issue.epic : issue.epic.name || '') : '',
                  component: typeof issue.component === 'string' ? issue.component : (issue.component ? issue.component.name || '' : ''),
                  assignee: issue.assignee || issue.user || null,
                  storyPoints: issue.bizPoint || 0,
                  priority: (issue.issueImportance === 'HIGH' 
                    ? 'high' 
                    : issue.issueImportance === 'MEDIUM' 
                      ? 'medium' 
                      : 'low') as 'low' | 'medium' | 'high',
                  status: statusKey as 'todo' | 'inProgress' | 'done',
                  description: issue.content || '',
                  sprint: issue.sprint?.name || '',
                };

                componentGroup.issues.push(formattedIssue);
              });
            });

            console.log('Converted sprint data:', convertedData);
            setSprintData(convertedData);
          } else {
            console.log('No data from ongoing sprint API, fallback to getSprintData');
            // 활성 스프린트 API가 데이터를 반환하지 않으면 기존 API로 폴백
            const data = await getSprintData(undefined, projectId);
            console.log('Fallback data from getSprintData:', data);
            setSprintData(data);
          }
        } catch (ongoingSprintError) {
          console.error('Error fetching ongoing sprint data:', ongoingSprintError);
          console.log('Fallback to original getSprintData due to error');
          
          // 오류 발생 시 기존 API로 폴백
          try {
            const data = await getSprintData(undefined, projectId);
            console.log('Fallback data received:', data);
            setSprintData(data);
          } catch (fallbackError: any) {
            console.error('Fallback API also failed:', fallbackError);
            // 에러 메시지 파싱
            if (fallbackError?.message?.includes('No sprint found') || fallbackError?.message?.includes('sprint not found')) {
              setError('현재 프로젝트에 활성 스프린트가 존재하지 않습니다. 스프린트를 먼저 생성해주세요.');
            } else {
              setError('스프린트 데이터를 불러오는 중 오류가 발생했습니다.');
            }
          }
        }
      } catch (err: any) {
        // 에러 메시지 파싱
        console.error('Error details:', err);
        if (err?.message?.includes('No sprint found') || err?.message?.includes('sprint not found')) {
          setError('현재 프로젝트에 활성 스프린트가 존재하지 않습니다. 스프린트를 먼저 생성해주세요.');
        } else {
          setError('스프린트 데이터를 불러오는 중 오류가 발생했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleIssueClick = useCallback((issue: Issue) => {
    console.log('Issue clicked:', issue.id);
    // 이슈 상세 모달 열기 플래그 먼저 설정
    setIsModalOpen(true);
    // 선택된 이슈 설정
    setSelectedIssue(issue);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // 이슈 참조 정리
    setSelectedIssue(null);
  }, []);

  const handleUpdateIssue = useCallback((updatedIssue: Issue) => {
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

    // 업데이트된 상태 그룹으로 스프린트 데이터 업데이트
    setSprintData({
      ...sprintData,
      statusGroups: updatedStatusGroups,
    });
  }, [sprintData]);

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
    }
  };

  // 펼쳐진 컴포넌트 그룹 이름 관리
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());

  // 컴포넌트별 이슈 총 개수를 계산하는 함수
  const getComponentIssueCounts = () => {
    if (!sprintData) return {};

    const counts: { [key: string]: number } = {};

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
      // 필터가 없을 때 초기 상태로 돌리기
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
          (group) => group.id === sourceStatusId,
        );

        if (!sourceStatusGroup) {
          console.error(`Status group not found: ${sourceStatusId}`);
          return;
        }

        const sourceComponentGroup = sourceStatusGroup.componentGroups.find(
          (group) => group.id === sourceComponentId,
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
          console.error(
            `Invalid source index: ${source.index}, issues length: ${sourceComponentGroup.issues.length}`,
          );
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
          // 목적지 컴포넌트 그룹에서 컴포넌트 이름 가져오기
          const destStatusGroup = newSprintData.statusGroups.find(
            (group) => group.id === destStatusId,
          );

          const destComponentGroup = destStatusGroup?.componentGroups.find(
            (group) => group.id === destComponentId,
          );

          if (destComponentGroup) {
            // 컴포넌트 이름 업데이트
            movedIssue.component = destComponentGroup.name;
          }

          // API 호출
          try {
            await updateIssueComponent(movedIssue.id, destComponentId);
          } catch (err) {
            console.error('이슈 컴포넌트 업데이트 실패:', err);
          }
        }

        // 목적지 상태 그룹과 컴포넌트 그룹 찾기
        const destStatusGroup = newSprintData.statusGroups.find(
          (group) => group.id === destStatusId,
        );

        if (!destStatusGroup) {
          console.error(`Destination status group not found: ${destStatusId}`);
          return;
        }

        const destComponentGroup = destStatusGroup.componentGroups.find(
          (group) => group.id === destComponentId,
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

        // DnD 작업이 성공적으로 완료되면, 서버에서 최신 데이터를 다시 가져오기
        setTimeout(async () => {
          try {
            console.log('Refreshing data after drag and drop');
            try {
              // 우선 getOngoingSprintComponentIssues API 사용 시도
              const refreshedComponentIssueGroups = await getOngoingSprintComponentIssues();
              
              if (refreshedComponentIssueGroups && refreshedComponentIssueGroups.length > 0) {
                // 데이터 변환 및 업데이트 로직 반복 (fetchData와 유사한 로직)
                const convertedData: SprintData = {
                  statusGroups: [
                    {
                      id: 'todo',
                      status: 'todo',
                      title: '해야 할 일',
                      componentGroups: [],
                    },
                    {
                      id: 'inProgress',
                      status: 'inProgress',
                      title: '진행 중',
                      componentGroups: [],
                    },
                    {
                      id: 'done',
                      status: 'done',
                      title: '완료',
                      componentGroups: [],
                    },
                  ],
                };

                // 모든 고유 컴포넌트 식별
                const allComponentsMap = new Map<string, string>();
                refreshedComponentIssueGroups.forEach(group => {
                  group.issues.forEach(issue => {
                    if (issue.component && typeof issue.component !== 'string') {
                      const componentId = issue.component.id.toString();
                      if (!allComponentsMap.has(componentId)) {
                        allComponentsMap.set(componentId, issue.component.name);
                      }
                    }
                  });
                });

                // 컴포넌트가 없는 경우를 위한 기본 컴포넌트 추가
                if (allComponentsMap.size === 0) {
                  allComponentsMap.set('0', '미분류');
                }

                // 각 상태 그룹에 컴포넌트 그룹 초기화
                convertedData.statusGroups.forEach(statusGroup => {
                  allComponentsMap.forEach((componentName, componentId) => {
                    statusGroup.componentGroups.push({
                      id: componentId,
                      name: componentName,
                      isExpanded: true,
                      issues: [],
                    });
                  });
                });

                // 이슈를 적절한 상태 및 컴포넌트 그룹에 할당
                refreshedComponentIssueGroups.forEach(group => {
                  const statusKey = group.issueStatus === 'TODO' 
                    ? 'todo' 
                    : group.issueStatus === 'IN_PROGRESS' 
                      ? 'inProgress' 
                      : 'done';
                  
                  const statusGroup = convertedData.statusGroups.find(sg => sg.status === statusKey);
                  if (!statusGroup) return;

                  group.issues.forEach(issue => {
                    let componentId = '0';
                    if (issue.component) {
                      if (typeof issue.component !== 'string') {
                        componentId = issue.component.id.toString();
                      }
                    }

                    const componentGroup = statusGroup.componentGroups.find(cg => cg.id === componentId);
                    if (!componentGroup) return;

                    const formattedIssue: Issue = {
                      id: issue.id.toString(),
                      key: issue.key,
                      title: issue.name || '',
                      epic: issue.epic ? (typeof issue.epic === 'string' ? issue.epic : issue.epic.name || '') : '',
                      component: typeof issue.component === 'string' ? issue.component : (issue.component ? issue.component.name || '' : ''),
                      assignee: issue.assignee || issue.user || null,
                      storyPoints: issue.bizPoint || 0,
                      priority: (issue.issueImportance === 'HIGH' 
                        ? 'high' 
                        : issue.issueImportance === 'MEDIUM' 
                          ? 'medium' 
                          : 'low') as 'low' | 'medium' | 'high',
                      status: statusKey as 'todo' | 'inProgress' | 'done',
                      description: issue.content || '',
                      sprint: issue.sprint?.name || '',
                    };

                    componentGroup.issues.push(formattedIssue);
                  });
                });

                setSprintData(convertedData);
                console.log('Data refreshed successfully with ongoing sprint API');
              } else {
                console.log('No data from ongoing sprint API during refresh, fallback to getSprintData');
                // 활성 스프린트 API가 데이터를 반환하지 않으면 기존 API로 폴백
                const refreshedData = await getSprintData(undefined, projectId);
                setSprintData(refreshedData);
                console.log('Data refreshed successfully with fallback API');
              }
            } catch (ongoingApiError) {
              console.error('Error with ongoing sprint API during refresh:', ongoingApiError);
              console.log('Fallback to original getSprintData API for refresh');
              
              // 오류 발생 시 기존 API로 폴백
              const refreshedData = await getSprintData(undefined, projectId);
              setSprintData(refreshedData);
              console.log('Data refreshed successfully with fallback API');
            }
          } catch (refreshError) {
            console.error('스프린트 데이터 새로고침 실패:', refreshError);
          }
        }, 500); // 서버 업데이트에 약간의 지연 후 데이터 가져오기
      } catch (error) {
        console.error('드래그 앤 드롭 처리 중 오류 발생:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
        <div className='flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg'>
          <Loader2 className='text-primary mb-4 h-12 w-12 animate-spin' />
          <p className='text-lg font-medium text-gray-700'>스프린트 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-gray-50'>
        <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
          <div className='mb-4 flex items-center gap-3'>
            <AlertCircle className='text-warning h-8 w-8' />
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
                className='bg-primary hover:bg-primary/80 w-full rounded-md py-2 font-medium text-white transition-colors'
              >
                스프린트 생성하기
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className={`w-full rounded-md py-2 font-medium transition-colors ${error.includes('스프린트가 존재하지 않습니다')
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-primary hover:bg-primary/80 text-white'
                }`}
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
        <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
          <div className='mb-4 flex items-center gap-3'>
            <AlertCircle className='text-point h-8 w-8' />
            <h2 className='text-xl font-semibold text-gray-800'>데이터 없음</h2>
          </div>
          <p className='mb-4 text-gray-600'>스프린트 데이터를 불러올 수 없습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className='bg-primary hover:bg-primary/80 w-full rounded-md py-2 font-medium text-white transition-colors'
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
          componentGroup.issues.map((issue) => {
            if (typeof issue.assignee === 'string') {
              return issue.assignee;
            } else if (issue.assignee && issue.assignee.nickname) {
              return issue.assignee.nickname;
            }
            return '';
          }),
        ),
      ),
    ),
  ).filter((assignee) => assignee !== undefined && assignee !== null && assignee !== ''); // 빈 값 제거

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
          count += componentGroup.issues.filter((issue) => {
            if (typeof issue.assignee === 'string') {
              return issue.assignee === filterAssignee;
            } else if (issue.assignee && issue.assignee.nickname) {
              return issue.assignee.nickname === filterAssignee;
            }
            return false;
          }).length;
        }
      });
    });

    return count;
  };

  // 필터 이름 추출
  const getFilterName = () => {
    if (!activeFilter) return null;

    if (activeFilter.startsWith('component-')) {
      const componentName = activeFilter.replace('component-', '');
      return `컴포넌트: ${componentName}`;
    } else if (activeFilter.startsWith('assignee-')) {
      const assigneeName = activeFilter.replace('assignee-', '');
      return `담당자: ${assigneeName || '없음'}`;
    }
    return null;
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* 헤더 */}
      <div className='bg-background-secondary flex items-center justify-between p-4'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-heading-xs font-bold'>스프린트 보드</h1>
          <p className='text-label-lg text-gray-5'>작업 상태를 한눈에 파악하고 관리하세요</p>
          {activeFilter && (
            <div className='mt-2 flex items-center'>
              <span className='mr-2 text-sm text-gray-600'>필터링 중:</span>
              <span className='bg-primary/10 text-primary inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium'>
                {getFilterName()} ({getTotalFilteredIssuesCount()}개 이슈)
              </span>
            </div>
          )}
        </div>
      </div>

      <section className='bg-background-primary flex flex-col gap-4 p-4'>
        {/* 필터 섹션 */}
        <div className='rounded-lg border border-gray-100 bg-white p-6 shadow-sm'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Filter size={18} className='text-primary' />
              <h3 className='font-semibold text-gray-800'>필터</h3>
            </div>
            {activeFilter && (
              <button
                className='flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-200'
                onClick={() => setActiveFilter(null)}
              >
                필터 초기화
                <X size={16} />
              </button>
            )}
          </div>

          <div className='flex flex-col gap-6'>
            {/* 컴포넌트 필터 */}
            <div>
              <div className='mb-3 flex items-center gap-2'>
                <Tag size={16} className='text-primary' />
                <span className='text-sm font-medium text-gray-700'>컴포넌트</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {allComponents.map((component, index) => (
                  <button
                    key={index}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeFilter === `component-${component}`
                        ? 'bg-primary text-white shadow-sm'
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
            <div>
              <div className='mb-3 flex items-center gap-2'>
                <Users size={16} className='text-point' />
                <span className='text-sm font-medium text-gray-700'>담당자</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {allAssignees.map((assignee, index) => (
                  <button
                    key={index}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${activeFilter === `assignee-${assignee}`
                        ? 'bg-point text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                    onClick={() => {
                      setActiveFilter(
                        activeFilter === `assignee-${assignee}` ? null : `assignee-${assignee}`,
                      );
                    }}
                  >
                    {assignee}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 보드 섹션 */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {sprintData.statusGroups.map((statusGroup) => {
              // 상태 그룹의 모든 컴포넌트 그룹에 대한 필터링된 사본 생성
              const filteredComponentGroups = statusGroup.componentGroups.map((componentGroup) => {
                // 필터가 없으면 원래 컴포넌트 그룹을 그대로 반환
                if (!activeFilter) {
                  return componentGroup;
                }

                // 컴포넌트 필터가 활성화된 경우
                if (activeFilter.startsWith('component-')) {
                  const filterComponent = activeFilter.replace('component-', '');
                  // 컴포넌트 이름이 필터와 일치하지 않으면 빈 이슈 배열 반환
                  if (componentGroup.name !== filterComponent) {
                    return { ...componentGroup, issues: [] };
                  }
                  // 일치하는 경우 원래 컴포넌트 그룹 반환
                  return componentGroup;
                }

                // 담당자 필터가 활성화된 경우
                if (activeFilter.startsWith('assignee-')) {
                  const filterAssignee = activeFilter.replace('assignee-', '');

                  // 이슈 중 담당자가 필터와 일치하는 것만 유지
                  const filteredIssues = componentGroup.issues.filter((issue) => {
                    if (typeof issue.assignee === 'string') {
                      return issue.assignee === filterAssignee;
                    } else if (issue.assignee && issue.assignee.nickname) {
                      return issue.assignee.nickname === filterAssignee;
                    }
                    return false;
                  });

                  return {
                    ...componentGroup,
                    issues: filteredIssues,
                  };
                }

                // 다른 필터의 경우 기본값 반환
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
                  expandedComponents={expandedComponents}
                  onToggleExpand={handleToggleExpand}
                  onIssueClick={handleIssueClick}
                  filterActive={activeFilter !== null}
                  componentIssueCounts={componentIssueCounts}
                />
              );
            })}
          </div>
        </DragDropContext>
      </section>

      {/* 이슈 상세 모달 */}
      <SprintIssueDetailModal
        isOpen={isModalOpen}
        selectedIssue={selectedIssue}
        onClose={handleCloseModal}
        onDelete={handleDeleteIssue}
        onUpdate={handleUpdateIssue}
      />
    </div>
  );
};

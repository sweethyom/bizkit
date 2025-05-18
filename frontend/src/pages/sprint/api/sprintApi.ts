import { mockSprintData } from '@/pages/sprint/model/mock';
import { ComponentIssueGroup, Issue, SprintData } from '@/pages/sprint/model/types';
import { api, ApiResponse } from '@/shared/api';

// 목업 데이터 사용 여부 (개발 시에만 true, 실제 서버 연동 시 false로 설정)
const USE_MOCK = false;

// 프로젝트의 스프린트 목록 조회 - API 명세: GET /projects/{projectId}/sprints
export const getProjectSprints = async (projectId: string): Promise<any[]> => {
  if (USE_MOCK) {
    // 목업 데이터 사용
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: '활성하기 전 스프린트 이름',
            status: 'READY',
            startDate: '2025-04-30',
            dueDate: '2025-05-01',
            completedDate: null
          },
          {
            id: 2,
            name: '활성화 된 스프린트 이름',
            status: 'ONGOING',
            startDate: '2025-04-30',
            dueDate: '2025-05-01',
            completedDate: null
          },
          {
            id: 3,
            name: '종료된 스프린트 이름',
            status: 'COMPLETED',
            startDate: '2025-04-29',
            dueDate: '2025-05-01',
            completedDate: '2025-04-30'
          }
        ]);
      }, 500);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/sprints`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(`Failed to fetch sprints for project ${projectId}`);
    }
  }
};

// 현재 활성 스프린트의 ID를 찾는 함수 (활성 스프린트가 없을 경우 대체 스프린트 찾기)
export const findActiveSprintId = async (projectId: string): Promise<string | null> => {
  try {
    const sprints = await getProjectSprints(projectId);
    
    if (sprints.length === 0) {
      return null; // 스프린트가 없는 경우
    }
    
    // 1. 활성 스프린트 찾기 (ONGOING)
    const activeSprint = sprints.find(sprint => sprint.status === 'ONGOING');
    if (activeSprint) {
      return activeSprint.id.toString();
    }
    
    // 2. 활성 스프린트가 없는 경우, 준비 상태(READY)의 스프린트 찾기
    const readySprint = sprints.find(sprint => sprint.status === 'READY');
    if (readySprint) {
      return readySprint.id.toString();
    }
    
    // 3. 준비 상태의 스프린트도 없는 경우, 마지막에 종료된 스프린트 사용
    // 일반적으로 가장 최근에 종료된 스프린트가 더 관련성이 높음
    const completedSprints = sprints.filter(sprint => sprint.status === 'COMPLETED');
    if (completedSprints.length > 0) {
      // completedDate가 가장 최근인 스프린트 찾기
      completedSprints.sort((a, b) => {
        const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
        const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
        return dateB - dateA; // 내림차순 정렬 (가장 최근 종료된 것이 먼저)
      });
      return completedSprints[0].id.toString();
    }
    
    // 4. 전부 실패한 경우, 그냥 처음 스프린트를 사용
    return sprints[0].id.toString();
  } catch (error) {
    console.error('Failed to find active sprint:', error);
    return null;
  }
};

// 스프린트의 이슈 데이터 조회
export const getSprintData = async (sprintId?: string, projectId?: string): Promise<SprintData> => {
  if (USE_MOCK) {
    // 목업 데이터 사용
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSprintData);
      }, 500);
    });
  } else {
    // 실제 API 호출
    // sprintId가 없는 경우, 프로젝트의 활성 스프린트를 찾아서 그 스프린트의 이슈를 가져옴
    let targetSprintId = sprintId;
    
    if (!targetSprintId && projectId) {
      targetSprintId = await findActiveSprintId(projectId);
      if (!targetSprintId) {
        // 프로젝트에 스프린트가 없는 경우
        throw new Error('No sprint found for this project');
      }
    }
    
    if (!targetSprintId) {
      throw new Error('No sprint ID specified or found');
    }
    
    const response = await api.get<ApiResponse<any>>(`/sprints/${targetSprintId}/issues`);
    
    // API 응답 변환: 백엔드 API 형식을 프론트엔드 모델로 변환
    // API 응답이 result: "SUCCESS", data: [...] 형식이므로 data 필드를 추출
    if (response.data.result === 'SUCCESS' && response.data.data) {
      // 백엔드 응답을 프론트엔드 모델로 변환
      const sprintData: SprintData = {
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

      // 컴포넌트 그룹화 처리
      const issues = response.data.data;
      const componentMap = new Map();

      // 모든 컴포넌트 그룹 수집
      issues.forEach((issue: any) => {
        const componentId = issue.component?.id || 'none';
        const componentName = issue.component?.name || '할당되지 않음';
        
        if (!componentMap.has(componentId)) {
          componentMap.set(componentId, componentName);
        }
      });

      // 각 상태 그룹에 대해 컴포넌트 그룹 생성
      sprintData.statusGroups.forEach(statusGroup => {
        componentMap.forEach((componentName, componentId) => {
          statusGroup.componentGroups.push({
            id: componentId,
            name: componentName,
            isExpanded: true,
            issues: [],
          });
        });
      });

      // 이슈를 적절한 상태 그룹과 컴포넌트 그룹에 할당
      issues.forEach((issue: any) => {
        const componentId = issue.component?.id || 'none';
        const status = issue.issueStatus === 'TODO' ? 'todo' :
                      issue.issueStatus === 'IN_PROGRESS' ? 'inProgress' :
                      issue.issueStatus === 'DONE' ? 'done' : 'todo';

        // 해당 상태 그룹 찾기
        const statusGroup = sprintData.statusGroups.find(group => group.status === status);
        if (!statusGroup) return;

        // 해당 컴포넌트 그룹 찾기
        const componentGroup = statusGroup.componentGroups.find(group => group.id === componentId);
        if (!componentGroup) return;

        // 이슈 변환 및 추가
        componentGroup.issues.push({
          id: issue.id.toString(),
          key: issue.key,
          title: issue.name,
          epic: issue.epic?.name || '',
          component: issue.component?.name || '',
          assignee: issue.assignee?.nickname || '',
          storyPoints: issue.bizPoint || 0,
          priority: (issue.issueImportance === 'HIGH' ? 'high' : 
                    issue.issueImportance === 'MEDIUM' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          status: status as 'todo' | 'inProgress' | 'done',
          description: issue.content || '',
          sprint: issue.sprint?.name || '',
        });
      });

      return sprintData;
    } else {
      throw new Error('Failed to fetch sprint data');
    }
  }
};

// 이슈 상세 조회
export const getIssueDetail = async (issueId: string): Promise<Issue> => {
  if (USE_MOCK) {
    // 목업 데이터에서 이슈 찾기
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 모든 상태 그룹과 컴포넌트 그룹을 순회하면서 해당 ID의 이슈 찾기
        for (const statusGroup of mockSprintData.statusGroups) {
          for (const componentGroup of statusGroup.componentGroups) {
            const issue = componentGroup.issues.find((issue) => issue.id === issueId);
            if (issue) {
              // 이슈를 찾으면 반환
              resolve({
                ...issue,
                description: '이 이슈에 대한 상세 설명입니다.', // 샘플 설명 추가
                sprint: '스프린트 1', // 샘플 스프린트 정보 추가
              });
              return;
            }
          }
        }
        // 이슈를 찾지 못한 경우 에러 반환
        reject(new Error(`Issue with ID ${issueId} not found`));
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/issues/${issueId}`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      const issueData = response.data.data;
      
      // API 응답을 프론트엔드 모델로 변환
      return {
        id: issueData.id.toString(),
        key: issueData.key,
        title: issueData.name,
        description: issueData.content || '',
        epic: issueData.epic?.name || '',
        component: issueData.component?.name || '',
        assignee: issueData.assignee?.nickname || '',
        storyPoints: issueData.bizPoint || 0,
        priority: (issueData.issueImportance === 'HIGH' ? 'high' : 
                  issueData.issueImportance === 'MEDIUM' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        status: (issueData.issueStatus === 'TODO' ? 'todo' :
                issueData.issueStatus === 'IN_PROGRESS' ? 'inProgress' :
                'done') as 'todo' | 'inProgress' | 'done',
        sprint: issueData.sprint?.name || '',
      };
    } else {
      throw new Error(`Failed to fetch issue details for ID ${issueId}`);
    }
  }
};

// 이슈 진행 상태 수정 - API 명세: PATCH /issues/{issueId}/status
export const updateIssueStatus = async (
  issueId: string,
  newStatus: 'todo' | 'inProgress' | 'done',
): Promise<void> => {
  // API 명세에 따르면 PATCH 메서드 사용, 그리고 값은 TODO, IN_PROGRESS, DONE 사용
  // 클라이언트에서는 소문자로 사용하고 있으므로 여기서 변환
  const apiStatus =
    newStatus === 'todo' ? 'TODO' : newStatus === 'inProgress' ? 'IN_PROGRESS' : 'DONE';

  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} updated to ${apiStatus}`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/status`, { issueStatus: apiStatus });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue status to ${apiStatus}`);
    }
  }
};

// 이슈 컴포넌트 수정 - API 명세: PATCH /issues/{issueId}/component
export const updateIssueComponent = async (issueId: string, componentId: string | null): Promise<void> => {
  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} moved to component ${componentId}`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/component`, { componentId });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue component to ${componentId}`);
    }
  }
};

// 이슈 삭제 - API 명세: DELETE /issues/{issueId}
export const deleteIssue = async (issueId: string): Promise<void> => {
  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} deleted`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출 - API 명세에 맞게 DELETE 메서드 사용
    const response = await api.delete<ApiResponse<void>>(`/issues/${issueId}`);
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to delete issue ${issueId}`);
    }
  }
};

// 이슈 이름 수정 - API 명세: PATCH /issues/{issueId}/name
export const updateIssueName = async (issueId: string, name: string): Promise<void> => {
  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} name updated to ${name}`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출 - API 명세에 맞게 name 키로 전송
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/name`, { name });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue name to ${name}`);
    }
  }
};

// 이슈 내용 수정 - API 명세: PATCH /issues/{issueId}/content
export const updateIssueContent = async (issueId: string, content: string): Promise<void> => {
  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} content updated`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출 - API 명세에 맞게 content 키로 전송
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/content`, { content });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue content`);
    }
  }
};

// 이슈 담당자 수정 - API 명세: PATCH /issues/{issueId}/assignee
export const updateIssueAssignee = async (issueId: string, assigneeId: string | null): Promise<void> => {
  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} assignee updated to ${assigneeId}`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/assignee`, { assigneeId });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue assignee to ${assigneeId}`);
    }
  }
};

// 이슈 중요도 수정 - API 명세: PATCH /issues/{issueId}/importance
export const updateIssueImportance = async (
  issueId: string,
  importance: 'low' | 'medium' | 'high',
): Promise<void> => {
  // API 명세에 따르면 HIGH, MEDIUM, LOW 중 하나로 변환
  const apiImportance = importance === 'high' ? 'HIGH' : importance === 'medium' ? 'MEDIUM' : 'LOW';

  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} importance updated to ${apiImportance}`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/importance`, {
      issueImportance: apiImportance,
    });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue importance to ${apiImportance}`);
    }
  }
};

// 이슈 비즈포인트 수정 - API 명세: PATCH /issues/{issueId}/bizPoint
export const updateIssueBizpoint = async (issueId: string, bizpoint: number): Promise<void> => {
  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} bizpoint updated to ${bizpoint}`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출 - API 명세에 맞게 bizPoint 로 키를 지정
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/bizPoint`, { bizPoint: bizpoint });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue bizpoint to ${bizpoint}`);
    }
  }
};

// 프로젝트의 에픽 목록 조회 - API 명세: GET /projects/{projectId}/epics
export const getProjectEpics = async (projectId: string): Promise<any[]> => {
  if (USE_MOCK) {
    // 목업 데이터 사용
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '로그인 기능' },
          { id: 2, name: '게시판 기능' },
          { id: 3, name: '알림 기능' },
        ]);
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/epics`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(`Failed to fetch epics for project ${projectId}`);
    }
  }
};

// 프로젝트의 컴포넌트 목록 조회 - API 명세: GET /projects/{projectId}/components
export const getProjectComponents = async (projectId: string): Promise<any[]> => {
  if (USE_MOCK) {
    // 목업 데이터 사용
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '프론트엔드' },
          { id: 2, name: '백엔드' },
          { id: 3, name: '데이터베이스' },
          { id: 4, name: 'UI/UX' }
        ]);
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/components`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(`Failed to fetch components for project ${projectId}`);
    }
  }
};

// 프로젝트의 멤버 목록 조회 - API 명세: GET /projects/{projectId}/members
export const getProjectMembers = async (projectId: string): Promise<any[]> => {
  if (USE_MOCK) {
    // 목업 데이터 사용
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, nickname: '홍길동', email: 'hong@test.com' },
          { id: 2, nickname: '김철수', email: 'kim@test.com' },
          { id: 3, nickname: '이영희', email: 'lee@test.com' }
        ]);
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/members`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(`Failed to fetch members for project ${projectId}`);
    }
  }
};

// 이슈의 스프린트 변경 - API 명세: PATCH /issues/{issueId}/sprint
export const updateIssueSprint = async (issueId: string, sprintId: string | null): Promise<void> => {
  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} sprint updated to ${sprintId}`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/sprint`, { sprintId });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue sprint to ${sprintId}`);
    }
  }
};

// 이슈의 에픽 변경 - API 명세: PATCH /issues/{issueId}/epic
export const updateIssueEpic = async (issueId: string, epicId: string | null): Promise<void> => {
  if (USE_MOCK) {
    // 목업 응답
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Issue ${issueId} epic updated to ${epicId}`);
        resolve();
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/epic`, { epicId });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue epic to ${epicId}`);
    }
  }
};

// 에픽에 이슈 목록 조회 - API 명세: GET /epics/{epicId}/issues
export const getEpicIssues = async (epicId: string): Promise<Issue[]> => {
  if (USE_MOCK) {
    // 목업 응답: epicId에 해당하는 이슈들만 필터링
    return new Promise((resolve) => {
      setTimeout(() => {
        const issuesList: Issue[] = [];
        mockSprintData.statusGroups.forEach((statusGroup) => {
          statusGroup.componentGroups.forEach((componentGroup) => {
            componentGroup.issues.forEach((issue) => {
              if (issue.epic === epicId) {
                issuesList.push(issue);
              }
            });
          });
        });
        resolve(issuesList);
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/epics/${epicId}/issues`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      // API 응답 데이터를 프론트엔드 모델로 변환
      return response.data.data.map((issueData: any) => ({
        id: issueData.id.toString(),
        key: issueData.key,
        title: issueData.name,
        epic: issueData.epic?.name || '',
        component: issueData.component?.name || '',
        assignee: issueData.assignee?.nickname || '',
        storyPoints: issueData.bizPoint || 0,
        priority: (issueData.issueImportance === 'HIGH' ? 'high' : 
                  issueData.issueImportance === 'MEDIUM' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        status: (issueData.issueStatus === 'TODO' ? 'todo' :
                issueData.issueStatus === 'IN_PROGRESS' ? 'inProgress' :
                'done') as 'todo' | 'inProgress' | 'done',
      }));
    } else {
      throw new Error(`Failed to fetch issues for epic ${epicId}`);
    }
  }
};

// 스프린트에 이슈 목록 조회 - API 명세: GET /sprints/{sprintId}/issues
export const getSprintIssues = async (sprintId: string): Promise<Issue[]> => {
  if (USE_MOCK) {
    // 목업 응답: 모든 이슈 반환 (실제로는 스프린트별로 필터링)
    return new Promise((resolve) => {
      setTimeout(() => {
        const issuesList: Issue[] = [];
        mockSprintData.statusGroups.forEach((statusGroup) => {
          statusGroup.componentGroups.forEach((componentGroup) => {
            issuesList.push(...componentGroup.issues);
          });
        });
        resolve(issuesList);
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/sprints/${sprintId}/issues`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      return response.data.data.map((issueData: any) => ({
        id: issueData.id.toString(),
        key: issueData.key,
        title: issueData.name,
        epic: issueData.epic?.name || '',
        component: issueData.component?.name || '',
        assignee: issueData.assignee?.nickname || '',
        storyPoints: issueData.bizPoint || 0,
        priority: (issueData.issueImportance === 'HIGH' ? 'high' : 
                  issueData.issueImportance === 'MEDIUM' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        status: (issueData.issueStatus === 'TODO' ? 'todo' :
                issueData.issueStatus === 'IN_PROGRESS' ? 'inProgress' :
                'done') as 'todo' | 'inProgress' | 'done',
        description: issueData.content || '',
        sprint: issueData.sprint?.name || '',
      }));
    } else {
      throw new Error(`Failed to fetch issues for sprint ${sprintId}`);
    }
  }
};

// 컴포넌트별 이슈 목록 조회 - API 명세: GET /components/{componentId}/issues
// API 명세에 따라 이슈는 상태(TODO, IN_PROGRESS, DONE)별로 그룹화되어야 함
export const getComponentIssues = async (componentId: string): Promise<ComponentIssueGroup[]> => {
  if (USE_MOCK) {
    // 목업 응답: componentId에 해당하는 이슈들을 상태별로 그룹화
    return new Promise((resolve) => {
      setTimeout(() => {
        const issuesByStatus: { [key: string]: Issue[] } = {
          TODO: [],
          IN_PROGRESS: [],
          DONE: []
        };
        
        mockSprintData.statusGroups.forEach((statusGroup) => {
          statusGroup.componentGroups.forEach((componentGroup) => {
            if (componentGroup.id === componentId) {
              componentGroup.issues.forEach(issue => {
                const apiStatus = issue.status === 'todo' ? 'TODO' : 
                                 issue.status === 'inProgress' ? 'IN_PROGRESS' : 'DONE';
                issuesByStatus[apiStatus].push(issue);
              });
            }
          });
        });
        
        // 결과를 API 명세 형식으로 변환
        const result = Object.entries(issuesByStatus).map(([status, issues]) => ({
          issueStatus: status,
          issues: issues
        }));
        
        resolve(result);
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/components/${componentId}/issues`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      // API 응답 데이터를 프론트엔드 모델로 변환
      // 명세에 따르면 이미 상태별로 그룹화된 형태로 응답이 오는 것으로 예상
      return response.data.data.map((group: any) => ({
        issueStatus: group.issueStatus,
        issues: group.issues.map((issueData: any) => ({
          id: issueData.id.toString(),
          key: issueData.key,
          title: issueData.name,
          epic: issueData.epic?.name || '',
          component: issueData.component?.name || '',
          assignee: issueData.assignee?.nickname || '',
          storyPoints: issueData.bizPoint || 0,
          priority: (issueData.issueImportance === 'HIGH' ? 'high' : 
                    issueData.issueImportance === 'MEDIUM' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
          status: (issueData.issueStatus === 'TODO' ? 'todo' :
                  issueData.issueStatus === 'IN_PROGRESS' ? 'inProgress' :
                  'done') as 'todo' | 'inProgress' | 'done',
          description: issueData.content || '',
          sprint: issueData.sprint?.name || '',
        }))
      }));
    } else {
      throw new Error(`Failed to fetch issues for component ${componentId}`);
    }
  }
};

// 내 이슈 목록 조회 - API 명세: GET /issues/me
export const getMyIssues = async (): Promise<Issue[]> => {
  if (USE_MOCK) {
    // 목업 응답: 현재 사용자에게 할당된 이슈들만 필터링 (임의의 사용자 ID 사용)
    const currentUserId = '홍길동'; // 실제로는 로그인한 사용자 ID를 사용

    return new Promise((resolve) => {
      setTimeout(() => {
        const issuesList: Issue[] = [];
        mockSprintData.statusGroups.forEach((statusGroup) => {
          statusGroup.componentGroups.forEach((componentGroup) => {
            componentGroup.issues.forEach((issue) => {
              if (issue.assignee === currentUserId) {
                issuesList.push(issue);
              }
            });
          });
        });
        resolve(issuesList);
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/issues/me`);
    
    if (response.data.result === 'SUCCESS' && response.data.data) {
      return response.data.data.map((issueData: any) => ({
        id: issueData.id.toString(),
        key: issueData.key,
        title: issueData.name,
        epic: issueData.epic?.name || '',
        component: issueData.component?.name || '',
        assignee: issueData.assignee?.nickname || '',
        storyPoints: issueData.bizPoint || 0,
        priority: (issueData.issueImportance === 'HIGH' ? 'high' : 
                  issueData.issueImportance === 'MEDIUM' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        status: (issueData.issueStatus === 'TODO' ? 'todo' :
                issueData.issueStatus === 'IN_PROGRESS' ? 'inProgress' :
                'done') as 'todo' | 'inProgress' | 'done',
        description: issueData.content || '',
        sprint: issueData.sprint?.name || '',
      }));
    } else {
      throw new Error('Failed to fetch my issues');
    }
  }
};

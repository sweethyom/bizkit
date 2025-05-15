import { mockSprintData } from '@/pages/sprint/model/mock';
import { Issue, SprintData } from '@/pages/sprint/model/types';
import { api, ApiResponse } from '@/shared/api';

// 목업 데이터 사용 여부 (개발 시에만 true, 실제 서버 연동 시 false로 설정)
const USE_MOCK = false;

// 스프린트의 이슈 데이터 조회
export const getSprintData = async (sprintId?: string): Promise<SprintData> => {
  if (USE_MOCK) {
    // 목업 데이터 사용
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSprintData);
      }, 500);
    });
  } else {
    // 실제 API 호출
    // sprintId가 없는 경우 현재 활성 스프린트 또는 기본 스프린트를 가져오도록 처리
    const url = sprintId ? `/sprints/${sprintId}/issues` : '/sprints/active/issues';
    const response = await api.get<ApiResponse<any>>(url);
    
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

// 이슈 상태 업데이트 - API 명세: PATCH /issues/{issueId}/status
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
export const updateIssueComponent = async (issueId: string, componentId: string): Promise<void> => {
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
    // 실제 API 호출
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
    // 실제 API 호출
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
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/content`, { content });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue content`);
    }
  }
};

// 이슈 담당자 수정 - API 명세: PATCH /issues/{issueId}/assignee
export const updateIssueAssignee = async (issueId: string, assigneeId: string): Promise<void> => {
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
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/bizPoint`, { bizPoint: bizpoint });
    
    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue bizpoint to ${bizpoint}`);
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
export const getComponentIssues = async (componentId: string): Promise<Issue[]> => {
  if (USE_MOCK) {
    // 목업 응답: componentId에 해당하는 이슈들만 필터링
    return new Promise((resolve) => {
      setTimeout(() => {
        const issuesList: Issue[] = [];
        mockSprintData.statusGroups.forEach((statusGroup) => {
          statusGroup.componentGroups.forEach((componentGroup) => {
            if (componentGroup.id === componentId) {
              issuesList.push(...componentGroup.issues);
            }
          });
        });
        resolve(issuesList);
      }, 300);
    });
  } else {
    // 실제 API 호출
    const response = await api.get<ApiResponse<any>>(`/components/${componentId}/issues`);
    
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
        description: issueData.content || '',
        sprint: issueData.sprint?.name || '',
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

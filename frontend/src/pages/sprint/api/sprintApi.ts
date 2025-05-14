import { mockSprintData } from '@/pages/sprint/model/mock';
import { Issue, SprintData } from '@/pages/sprint/model/types';
import { api } from '@/shared/api';

// 목업 데이터 사용 여부 (개발 시에만 true, 실제 서버 연동 시 false로 설정)
const USE_MOCK = true;

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
    const response = await api.get<{ result: string; data: SprintData }>(url);
    return response.data;
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
    const response = await api.get<{ result: string; data: Issue }>(`/issues/${issueId}`);
    return response.data;
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
    await api.patch<{ result: string }>(`/issues/${issueId}/status`, { issueStatus: apiStatus });
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
    await api.patch<{ result: string }>(`/issues/${issueId}/component`, { componentId });
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
    await api.delete<{ result: string }>(`/issues/${issueId}`);
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
    await api.patch<{ result: string }>(`/issues/${issueId}/name`, { name });
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
    await api.patch<{ result: string }>(`/issues/${issueId}/content`, { content });
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
    await api.patch<{ result: string }>(`/issues/${issueId}/assignee`, { assigneeId });
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
    await api.patch<{ result: string }>(`/issues/${issueId}/importance`, {
      issueImportance: apiImportance,
    });
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
    await api.patch<{ result: string }>(`/issues/${issueId}/bizPoint`, { bizPoint: bizpoint });
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
    const response = await api.get<{ result: string; data: Issue[] }>(`/epics/${epicId}/issues`);
    return response.data;
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
    const response = await api.get<{ result: string; data: Issue[] }>(
      `/sprints/${sprintId}/issues`,
    );
    return response.data;
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
    const response = await api.get<{ result: string; data: Issue[] }>(
      `/components/${componentId}/issues`,
    );
    return response.data;
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
    const response = await api.get<{ result: string; data: Issue[] }>(`/issues/me`);
    return response.data;
  }
};

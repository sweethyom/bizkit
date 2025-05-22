import { ComponentIssueGroup, Issue, SprintData } from '@/pages/sprint/model/types';
import { api, ApiResponse } from '@/shared/api';

// 프로젝트의 컴포넌트 목록 조회
export const getProjectComponents = async (projectId?: string): Promise<any[]> => {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    console.log(`[sprintApi.ts] 프로젝트 컴포넌트 목록 조회 - 프로젝트 ID: ${projectId}`);
    const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/components`);

    if (response.data.result === 'SUCCESS' && response.data.data) {
      console.log(`[sprintApi.ts] 프로젝트 컴포넌트 목록 조회 결과:`, response.data.data);
      return response.data.data;
    } else {
      console.log(`[sprintApi.ts] 프로젝트 컴포넌트 목록 없음`);
      return [];
    }
  } catch (error) {
    console.error('[sprintApi.ts] Error fetching project components:', error);
    return [];
  }
};

// 프로젝트의 스프린트 목록 조회 - API 명세: GET /projects/{projectId}/sprints
export const getProjectSprints = async (projectId: string): Promise<any[]> => {
  // 실제 API 호출
  const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/sprints`);

  if (response.data.result === 'SUCCESS' && response.data.data) {
    return response.data.data;
  } else {
    throw new Error(`Failed to fetch sprints for project ${projectId}`);
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
    // 백엔드의 스프린트 상태 필드명이 status 또는 sprintStatus일 수 있으므로 둘 다 확인
    const activeSprint = sprints.find((sprint) => {
      return sprint.sprintStatus === 'ONGOING' || sprint.status === 'ONGOING';
    });

    if (activeSprint) {
      return activeSprint.id.toString();
    }

    console.log('[sprintApi.ts] No active sprint found, checking for READY sprints');

    // 2. 활성 스프린트가 없는 경우, 준비 상태(READY)의 스프린트 찾기
    const readySprint = sprints.find((sprint) => {
      return sprint.sprintStatus === 'READY' || sprint.status === 'READY';
    });

    if (readySprint) {
      console.log(
        `[sprintApi.ts] Found ready sprint with id: ${readySprint.id}, but it needs to be started first`,
      );
      throw new Error('Ready sprint needs to be started from backlog page');
    }

    console.log('[sprintApi.ts] No ready sprints found, checking for completed sprints');

    // 3. 준비 상태의 스프린트도 없는 경우, 마지막에 종료된 스프린트 사용
    // 일반적으로 가장 최근에 종료된 스프린트가 더 관련성이 높음
    const completedSprints = sprints.filter((sprint) => {
      return sprint.sprintStatus === 'COMPLETED' || sprint.status === 'COMPLETED';
    });

    if (completedSprints.length > 0) {
      // completedDate가 가장 최근인 스프린트 찾기
      completedSprints.sort((a, b) => {
        const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
        const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
        return dateB - dateA; // 내림차순 정렬 (가장 최근 종료된 것이 먼저)
      });
      console.log(
        `[sprintApi.ts] Using most recently completed sprint id: ${completedSprints[0].id}`,
      );
      return completedSprints[0].id.toString();
    }

    // 4. 전부 실패한 경우, 그냥 처음 스프린트를 사용
    console.log(`[sprintApi.ts] Using first sprint as fallback, id: ${sprints[0].id}`);
    return sprints[0].id.toString();
  } catch (error) {
    console.error('[sprintApi.ts] Failed to find active sprint:', error);
    throw error;
  }
};

// 스프린트의 이슈 데이터 조회
export const getSprintData = async (sprintId?: string, projectId?: string): Promise<SprintData> => {
  // 실제 API 호출 (이 부분은 기존과 동일)
  let targetSprintId = sprintId;

  if (!targetSprintId && projectId) {
    targetSprintId = await findActiveSprintId(projectId);
    if (!targetSprintId) {
      throw new Error('No sprint found for this project');
    }
  }

  if (!targetSprintId) {
    throw new Error('No sprint ID specified or found');
  }

  const response = await api.get<ApiResponse<any>>(`/sprints/${targetSprintId}/issues`);

  console.log(response.data);

  if (response.data.result === 'SUCCESS' && response.data.data) {
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

    const issues = response.data.data;
    const allComponentsMap = new Map<string, string>();

    // 1. 스프린트에 존재하는 모든 고유 컴포넌트 목록 생성
    issues.forEach((issue: any) => {
      if (issue.component && typeof issue.component.id !== 'undefined' && issue.component.name) {
        const componentIdStr = issue.component.id.toString();
        if (!allComponentsMap.has(componentIdStr)) {
          allComponentsMap.set(componentIdStr, issue.component.name);
        }
      }
    });

    // 2. 각 상태 그룹에 대해 모든 식별된 컴포넌트 그룹을 기본적으로 생성
    sprintData.statusGroups.forEach((statusGroup) => {
      allComponentsMap.forEach((componentName, componentId) => {
        statusGroup.componentGroups.push({
          id: componentId,
          name: componentName,
          isExpanded: true, // 기본 확장 상태, 필요에 따라 조정
          issues: [],
        });
      });
    });

    // 3. 이슈를 적절한 상태 그룹 및 해당 컴포넌트 그룹에 할당
    issues.forEach((issue: any) => {
      const status =
        issue.issueStatus === 'TODO'
          ? 'todo'
          : issue.issueStatus === 'IN_PROGRESS'
            ? 'inProgress'
            : issue.issueStatus === 'DONE'
              ? 'done'
              : 'todo'; // 기본값 설정

      const statusGroup = sprintData.statusGroups.find((group) => group.status === status);
      if (!statusGroup) return;

      // 컴포넌트 정보가 있는 이슈인 경우에만 컴포넌트 그룹에 할당 시도
      if (issue.component && typeof issue.component.id !== 'undefined') {
        const componentIdStr = issue.component.id.toString();
        const componentGroup = statusGroup.componentGroups.find(
          (group) => group.id === componentIdStr,
        );

        if (componentGroup) {
          // 이슈 객체 생성
          componentGroup.issues.push({
            id: issue.id.toString(),
            key: issue.key,
            title: issue.name,
            epic: issue.epic?.name || '',
            assignee: issue.user
              ? {
                  id: issue.user.id,
                  nickname: issue.user.nickname || '',
                  profileImageUrl: issue.user.profileImgUrl || null,
                }
              : issue.assignee
                ? {
                    id: issue.assignee.id,
                    nickname: issue.assignee.nickname || '',
                    profileImageUrl: issue.assignee.profileImageUrl || null,
                  }
                : null,
            storyPoints: issue.bizPoint || 0,
            priority: (issue.issueImportance === 'HIGH'
              ? 'high'
              : issue.issueImportance === 'MEDIUM'
                ? 'medium'
                : 'low') as 'low' | 'medium' | 'high',
            status: status as 'todo' | 'inProgress' | 'done',
            description: issue.content || '',
            sprint: issue.sprint?.name || '',
            component: '',
          });
        }
      }
    });

    return sprintData;
  } else {
    throw new Error('Failed to fetch sprint data');
  }
};

// 스프린트에 이슈 목록 조회 - API 명세: GET /sprints/{sprintId}/issues
export const getSprintIssues = async (sprintId: string): Promise<Issue[]> => {
  // 실제 API 호출
  const response = await api.get<ApiResponse<any>>(`/sprints/${sprintId}/issues`);

  if (response.data.result === 'SUCCESS' && response.data.data) {
    return response.data.data.map((issueData: any) => ({
      id: issueData.id.toString(),
      key: issueData.key,
      title: issueData.name,
      epic: issueData.epic?.name || '',
      component: issueData.component?.name || '',
      assignee: issueData.assignee
        ? {
            id: issueData.assignee.id,
            nickname: issueData.assignee.nickname || '',
            profileImageUrl: issueData.assignee.profileImageUrl || null,
          }
        : null,
      storyPoints: issueData.bizPoint || 0,
      priority: (issueData.issueImportance === 'HIGH'
        ? 'high'
        : issueData.issueImportance === 'MEDIUM'
          ? 'medium'
          : 'low') as 'low' | 'medium' | 'high',
      status: (issueData.issueStatus === 'TODO'
        ? 'todo'
        : issueData.issueStatus === 'IN_PROGRESS'
          ? 'inProgress'
          : 'done') as 'todo' | 'inProgress' | 'done',
      description: issueData.content || '',
      sprint: issueData.sprint?.name || '',
    }));
  } else {
    throw new Error(`Failed to fetch issues for sprint ${sprintId}`);
  }
};

// 단일 컴포넌트에 대한 활성 스프린트 이슈 조회
// API 명세: GET /sprints/ongoing/{projectId}/components/issues?componentId=1
export const getOngoingSprintComponentIssue = async (
  projectId?: string,
  componentId?: string,
): Promise<ComponentIssueGroup[]> => {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    // API 호출 - 컴포넌트별 활성 스프린트 이슈 목록 조회
    const url = `/sprints/ongoing/${projectId}/components/issues`;
    const params: any = {};

    if (componentId) {
      params.componentId = componentId;
      console.log(
        `[sprintApi.ts] 컴포넌트별 이슈 조회 - 컴포넌트 ID: ${componentId}, 프로젝트 ID: ${projectId}`,
      );
    } else {
      console.log(`[sprintApi.ts] 전체 이슈 조회 (componentId 없음) - 프로젝트 ID: ${projectId}`);
    }

    const response = await api.get<ApiResponse<any>>(url, { params });

    if (response.data.result === 'SUCCESS') {
      const data = response.data.data || [];

      // 디버깅을 위한 로깅 추가
      if (componentId) {
        console.log(`[sprintApi.ts] 컴포넌트 ${componentId}의 이슈 조회 결과:`, data);
      } else {
        console.log(`[sprintApi.ts] 전체 이슈 조회 결과:`, data);
      }

      // data가 비어있어도 빈 배열 반환 - 빈 배열은 원래 이슈가 없는 경우가 아니라 기본 상태를 표시
      // 배열이 비어있을 경우에도 기본 상태그룹을 추가
      if (data.length === 0) {
        console.log(`[sprintApi.ts] 이슈 데이터가 없음 - 컴포넌트 ID: ${componentId || '없음'}`);
        if (!componentId) {
          // 컴포넌트 ID가 없는 경우(전체 조회)에만 기본 그룹 반환
          return [
            { issueStatus: 'TODO', issues: [] },
            { issueStatus: 'IN_PROGRESS', issues: [] },
            { issueStatus: 'DONE', issues: [] },
          ];
        }
        return []; // 특정 컴포넌트 조회시 이슈가 없으면 빈 배열 반환
      }

      return data.map((group: any) => ({
        issueStatus: group.issueStatus,
        issues: group.issues.map((issueData: any) => ({
          id: issueData.id.toString(),
          key: issueData.key,
          title: issueData.name || '',
          epic: issueData.epic
            ? typeof issueData.epic === 'string'
              ? issueData.epic
              : issueData.epic.name || ''
            : '',
          component:
            typeof issueData.component === 'string'
              ? issueData.component
              : issueData.component
                ? {
                    id: issueData.component.id.toString(),
                    name: issueData.component.name || '',
                  }
                : '',
          assignee: issueData.user
            ? {
                id: issueData.user.id,
                nickname: issueData.user.nickname || '',
                profileImageUrl: issueData.user.profileImgUrl || null,
              }
            : issueData.assignee
              ? {
                  id: issueData.assignee.id,
                  nickname: issueData.assignee.nickname || '',
                  profileImageUrl: issueData.assignee.profileImageUrl || null,
                }
              : null,
          storyPoints: issueData.bizPoint || 0,
          priority: (issueData.issueImportance === 'HIGH'
            ? 'high'
            : issueData.issueImportance === 'MEDIUM'
              ? 'medium'
              : 'low') as 'low' | 'medium' | 'high',
          status: (issueData.issueStatus === 'TODO'
            ? 'todo'
            : issueData.issueStatus === 'IN_PROGRESS'
              ? 'inProgress'
              : 'done') as 'todo' | 'inProgress' | 'done',
          description: issueData.content || '',
          sprint: issueData.sprint?.name || '',
          // API에서 제공하는 position 값 직접 사용
          position: issueData.position,
        })),
      }));
    } else {
      console.error(
        `[sprintApi.ts] API 오류 응답 (컴포넌트 ID: ${componentId || '없음'}):`,
        response.data,
      );
      return [];
    }
  } catch (error) {
    console.error(`[sprintApi.ts] 이슈 조회 오류 (컴포넌트 ID: ${componentId || '없음'}):`, error);
    return [];
  }
};

// 모든 컴포넌트에 대한 활성 스프린트 이슈 조회 (컴포넌트 목록 기반)
export const getOngoingSprintComponentIssues = async (
  projectId?: string,
): Promise<ComponentIssueGroup[]> => {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    console.log(
      `[sprintApi.ts] 활성 스프린트 모든 컴포넌트의 이슈 조회 시작 - 프로젝트 ID: ${projectId}`,
    );

    // 1. 프로젝트의 컴포넌트 목록 가져오기
    const components = await getProjectComponents(projectId);
    console.log(`[sprintApi.ts] 프로젝트에서 ${components.length}개의 컴포넌트 조회됨`);

    // 2. 활성 스프린트 확인
    try {
      const sprints = await getProjectSprints(projectId);
      const hasActiveSprint = sprints.some(
        (sprint) => sprint.sprintStatus === 'ONGOING' || sprint.status === 'ONGOING',
      );

      if (!hasActiveSprint) {
        console.log('[sprintApi.ts] 활성 스프린트가 없음');
        return [];
      }
      console.log('[sprintApi.ts] 활성 스프린트 확인됨');
    } catch (error) {
      console.error('[sprintApi.ts] 스프린트 상태 확인 중 오류:', error);
      // 오류는 기록하지만 계속 진행
    }

    // 3. 결과를 저장할 배열
    const allIssueGroups: ComponentIssueGroup[] = [];

    // 4. 컴포넌트별로 이슈 가져오기
    if (components.length === 0) {
      console.log('[sprintApi.ts] 컴포넌트가 없음, 미분류 이슈만 조회');

      // 4.1 컴포넌트가 없는 경우, 미할당된 이슈 조회 (componentId 없이 호출)
      const unassignedIssues = await getOngoingSprintComponentIssue(projectId);
      if (unassignedIssues && unassignedIssues.length > 0) {
        console.log(`[sprintApi.ts] 미할당 이슈 ${unassignedIssues.length}개 그룹 발견`);
        allIssueGroups.push(...unassignedIssues);
      }
    } else {
      // 4.2 각 컴포넌트별로 이슈 조회
      for (const component of components) {
        const componentId = component.id;
        console.log(`[sprintApi.ts] 컴포넌트 ${componentId}(${component.name}) 이슈 조회 중...`);

        const componentIssues = await getOngoingSprintComponentIssue(
          projectId,
          componentId.toString(),
        );

        if (componentIssues && componentIssues.length > 0) {
          console.log(
            `[sprintApi.ts] 컴포넌트 ${componentId}에서 ${componentIssues.length}개 상태 그룹 발견`,
          );

          // 이슈 개수 계산
          let issueCount = 0;
          componentIssues.forEach((group) => {
            if (group.issues && Array.isArray(group.issues)) {
              issueCount += group.issues.length;
            }
          });

          console.log(`[sprintApi.ts] 컴포넌트 ${componentId}에서 총 ${issueCount}개 이슈 발견`);

          // 컴포넌트 이름 설정
          componentIssues.forEach((group) => {
            group.issues.forEach((issue) => {
              // 컴포넌트 정보가 문자열일 경우 객체로 변환
              if (typeof issue.component === 'string') {
                issue.component = {
                  id: componentId.toString(),
                  name: component.name,
                };
              }
              // 컴포넌트 객체지만 name이 없는 경우 설정
              else if (typeof issue.component === 'object' && issue.component) {
                if (!issue.component.name) {
                  issue.component.name = component.name;
                }
              }
            });
          });

          allIssueGroups.push(...componentIssues);
        } else {
          console.log(`[sprintApi.ts] 컴포넌트 ${componentId}에서 이슈가 없음`);
        }
      }
    }

    // 전체 결과 요약
    let totalGroups = 0;
    let totalIssues = 0;
    allIssueGroups.forEach((group) => {
      totalGroups++;
      if (group.issues && Array.isArray(group.issues)) {
        totalIssues += group.issues.length;
      }
    });

    console.log(
      `[sprintApi.ts] 모든 컴포넌트에서 총 ${totalGroups}개 상태 그룹, ${totalIssues}개 이슈 발견`,
    );

    return allIssueGroups;
  } catch (error) {
    console.error('[sprintApi.ts] 전체 컴포넌트 이슈 조회 오류:', error);
    return [];
  }
};

import {
  deleteIssue as deleteIssueEntity,
  getIssueDetail as getIssueDetailEntity,
  updateIssueAssignee as updateIssueAssigneeEntity,
  updateIssueBizPoint,
  updateIssueComponent as updateIssueComponentEntity,
  updateIssueContent as updateIssueContentEntity,
  updateIssueEpic as updateIssueEpicEntity,
  updateIssueImportance as updateIssueImportanceEntity,
  updateIssueName as updateIssueNameEntity,
  updateIssueStatus as updateIssueStatusEntity,
} from '@/entities/issue';
import { ComponentIssueGroup, Issue, SprintData } from '@/pages/sprint/model/types';
import { api, ApiResponse } from '@/shared/api';

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
    const activeSprint = sprints.find((sprint) => sprint.status === 'ONGOING');
    if (activeSprint) {
      return activeSprint.id.toString();
    }

    // 2. 활성 스프린트가 없는 경우, 준비 상태(READY)의 스프린트 찾기
    const readySprint = sprints.find((sprint) => sprint.status === 'READY');
    if (readySprint) {
      return readySprint.id.toString();
    }

    // 3. 준비 상태의 스프린트도 없는 경우, 마지막에 종료된 스프린트 사용
    // 일반적으로 가장 최근에 종료된 스프린트가 더 관련성이 높음
    const completedSprints = sprints.filter((sprint) => sprint.status === 'COMPLETED');
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

// 이슈 상세 조회
export const getIssueDetail = async (issueId: string): Promise<Issue> => {
  try {
    // entities의 함수 사용 (string -> number 변환)
    const response = await getIssueDetailEntity(Number(issueId));

    if (response.result === 'SUCCESS' && response.data) {
      const issueData = response.data;

      // API 응답을 프론트엔드 모델로 변환
      return {
        id: issueData.id.toString(),
        key: issueData.key,
        title: issueData.name,
        description: issueData.content || '',
        epic: issueData.epic?.name || '',
        component: issueData.component?.name || '',
        assignee: issueData.assignee
          ? {
              id: issueData.assignee.id,
              nickname: issueData.assignee.nickname || '',
              profileImageUrl: issueData.assignee.profileImageUrl || null,
            }
          : issueData.user
            ? {
                id: issueData.user.id,
                nickname: issueData.user.nickname || '',
                profileImageUrl: issueData.user.profileImgUrl || null,
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
        sprint: issueData.sprint?.name || '',
      };
    } else {
      throw new Error(`Failed to fetch issue details for ID ${issueId}`);
    }
  } catch (error) {
    console.error(`Error fetching issue details: ${error}`);
    throw new Error(`Failed to fetch issue details for ID ${issueId}`);
  }
};

// 이슈 진행 상태 수정 - API 명세: PATCH /issues/{issueId}/status
export const updateIssueStatus = async (
  issueId: string,
  newStatus: 'todo' | 'inProgress' | 'done',
): Promise<void> => {
  try {
    // API 명세에 따르면 PATCH 메서드 사용, 그리고 값은 TODO, IN_PROGRESS, DONE 사용
    // 클라이언트에서는 소문자로 사용하고 있으므로 여기서 변환
    const apiStatus =
      newStatus === 'todo' ? 'TODO' : newStatus === 'inProgress' ? 'IN_PROGRESS' : 'DONE';

    // entities의 함수 사용
    await updateIssueStatusEntity(Number(issueId), apiStatus);
  } catch (error) {
    console.error(`Error updating issue status: ${error}`);
    throw new Error(`Failed to update issue status`);
  }
};

// 이슈 컴포넌트 수정 - API 명세: PATCH /issues/{issueId}/component
export const updateIssueComponent = async (
  issueId: string,
  componentId: string | null,
): Promise<void> => {
  try {
    // string -> number 변환, null 값 처리
    const numericIssueId = Number(issueId);
    const numericComponentId = componentId !== null ? Number(componentId) : null;

    // entities의 함수 사용
    await updateIssueComponentEntity(numericIssueId, numericComponentId as number);
  } catch (error) {
    console.error(`Error updating issue component: ${error}`);
    throw new Error(`Failed to update issue component`);
  }
};

// 이슈 삭제 - API 명세: DELETE /issues/{issueId}
export const deleteIssue = async (issueId: string): Promise<void> => {
  try {
    // entities의 함수 사용 (string -> number 변환)
    await deleteIssueEntity(Number(issueId));
  } catch (error) {
    console.error(`Error deleting issue: ${error}`);
    throw new Error(`Failed to delete issue ${issueId}`);
  }
};

// 이슈 이름 수정 - API 명세: PATCH /issues/{issueId}/name
export const updateIssueName = async (issueId: string, name: string): Promise<void> => {
  try {
    // entities의 함수 사용 (string -> number 변환)
    await updateIssueNameEntity(Number(issueId), name);
  } catch (error) {
    console.error(`Error updating issue name: ${error}`);
    throw new Error(`Failed to update issue name`);
  }
};

// 이슈 내용 수정 - API 명세: PATCH /issues/{issueId}/content
export const updateIssueContent = async (issueId: string, content: string): Promise<void> => {
  try {
    // entities의 함수 사용 (string -> number 변환)
    await updateIssueContentEntity(Number(issueId), content);
  } catch (error) {
    console.error(`Error updating issue content: ${error}`);
    throw new Error(`Failed to update issue content`);
  }
};

// 이슈 담당자 수정 - API 명세: PATCH /issues/{issueId}/assignee
export const updateIssueAssignee = async (
  issueId: string,
  assigneeId: string | null,
): Promise<void> => {
  try {
    // string -> number 변환, null 값 처리
    const numericIssueId = Number(issueId);
    const numericAssigneeId = assigneeId !== null ? Number(assigneeId) : null;

    // entities의 함수 사용
    await updateIssueAssigneeEntity(numericIssueId, numericAssigneeId as number);
  } catch (error) {
    console.error(`Error updating issue assignee: ${error}`);
    throw new Error(`Failed to update issue assignee`);
  }
};

// 이슈 중요도 수정 - API 명세: PATCH /issues/{issueId}/importance
export const updateIssueImportance = async (
  issueId: string,
  importance: 'low' | 'medium' | 'high',
): Promise<void> => {
  try {
    // API 명세에 따르면 HIGH, MEDIUM, LOW 중 하나로 변환
    const apiImportance =
      importance === 'high' ? 'HIGH' : importance === 'medium' ? 'MEDIUM' : 'LOW';

    // entities의 함수 사용 (string -> number 변환)
    await updateIssueImportanceEntity(Number(issueId), apiImportance as 'HIGH' | 'LOW');
  } catch (error) {
    console.error(`Error updating issue importance: ${error}`);
    throw new Error(`Failed to update issue importance`);
  }
};

// 이슈 비즈포인트 수정 - API 명세: PATCH /issues/{issueId}/bizPoint
export const updateIssueBizpoint = async (issueId: string, bizPoint: number): Promise<void> => {
  try {
    // entities의 함수 사용 (string -> number 변환)
    await updateIssueBizPoint(Number(issueId), bizPoint);
  } catch (error) {
    console.error(`Error updating issue bizpoint: ${error}`);
    throw new Error(`Failed to update issue bizpoint`);
  }
};
// 프로젝트의 에픽 목록 조회 - API 명세: GET /projects/{projectId}/epics
export const getProjectEpics = async (projectId: string): Promise<any[]> => {
  // 실제 API 호출
  const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/epics`);

  if (response.data.result === 'SUCCESS' && response.data.data) {
    return response.data.data;
  } else {
    throw new Error(`Failed to fetch epics for project ${projectId}`);
  }
};

// 프로젝트의 컴포넌트 목록 조회 - API 명세: GET /projects/{projectId}/components
export const getProjectComponents = async (projectId: string): Promise<any[]> => {
  // 실제 API 호출
  const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/components`);

  if (response.data.result === 'SUCCESS' && response.data.data) {
    return response.data.data;
  } else {
    throw new Error(`Failed to fetch components for project ${projectId}`);
  }
};

// 프로젝트의 멤버 목록 조회 - API 명세: GET /projects/{projectId}/members
export const getProjectMembers = async (projectId: string): Promise<any[]> => {
  // 실제 API 호출
  const response = await api.get<ApiResponse<any>>(`/projects/${projectId}/members`);

  if (response.data.result === 'SUCCESS' && response.data.data) {
    return response.data.data;
  } else {
    throw new Error(`Failed to fetch members for project ${projectId}`);
  }
};

// 이슈의 스프린트 변경 - API 명세: PATCH /issues/{issueId}/sprint
export const updateIssueSprint = async (
  issueId: string,
  sprintId: string | null,
): Promise<void> => {
  // 실제 API 호출
  const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/sprint`, { sprintId });

  if (response.data.result !== 'SUCCESS') {
    throw new Error(`Failed to update issue sprint to ${sprintId}`);
  }
};

// 이슈의 에픽 변경 - API 명세: PATCH /issues/{issueId}/epic
export const updateIssueEpic = async (issueId: string, epicId: string | null): Promise<void> => {
  try {
    // string -> number 변환, null 값 처리
    const numericIssueId = Number(issueId);
    const numericEpicId = epicId !== null ? Number(epicId) : null;

    // entities의 함수 사용
    await updateIssueEpicEntity(numericIssueId, numericEpicId as number);
  } catch (error) {
    console.error(`Error updating issue epic: ${error}`);
    throw new Error(`Failed to update issue epic`);
  }
};

// 에픽에 이슈 목록 조회 - API 명세: GET /epics/{epicId}/issues
export const getEpicIssues = async (epicId: string): Promise<Issue[]> => {
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
    }));
  } else {
    throw new Error(`Failed to fetch issues for epic ${epicId}`);
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

// 컴포넌트별 이슈 목록 조회 - API 명세: GET /components/{componentId}/issues
// API 명세에 따라 이슈는 상태(TODO, IN_PROGRESS, DONE)별로 그룹화되어야 함
export const getComponentIssues = async (componentId: string): Promise<ComponentIssueGroup[]> => {
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
        assignee: issueData.assignee
          ? {
              id: issueData.assignee.id,
              nickname: issueData.assignee.nickname || '',
              profileImageUrl: issueData.assignee.profileImageUrl || null,
            }
          : issueData.user
            ? {
                id: issueData.user.id,
                nickname: issueData.user.nickname || '',
                profileImageUrl: issueData.user.profileImgUrl || null,
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
      })),
    }));
  } else {
    throw new Error(`Failed to fetch issues for component ${componentId}`);
  }
};

// 컴포넌트별 활성 스프린트 이슈 목록 조회 - API 명세: GET /sprints/ongoing/components/issues
export const getOngoingSprintComponentIssues = async (
  componentId?: string,
): Promise<ComponentIssueGroup[]> => {
  // 실제 API 호출
  const url = componentId
    ? `/sprints/ongoing/components/issues?componentId=${componentId}`
    : '/sprints/ongoing/components/issues';
  const response = await api.get<ApiResponse<any>>(url);

  if (response.data.result === 'SUCCESS' && response.data.data) {
    // API 응답 데이터를 프론트엔드 모델로 변환
    return response.data.data.map((group: any) => ({
      issueStatus: group.issueStatus,
      issues: group.issues.map((issueData: any) => ({
        id: issueData.id.toString(),
        key: issueData.key,
        title: issueData.name,
        epic: issueData.epic?.name || '',
        component: issueData.component?.name || '',
        assignee: issueData.user
          ? {
              id: issueData.user.id,
              nickname: issueData.user.nickname || '',
              profileImageUrl: issueData.user.profileImgUrl || null,
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
      })),
    }));
  } else {
    throw new Error(`Failed to fetch ongoing sprint issues for component ${componentId || 'all'}`);
  }
};

// 내 이슈 목록 조회 - API 명세: GET /issues/me
export const getMyIssues = async (): Promise<Issue[]> => {
  // 실제 API 호출
  const response = await api.get<ApiResponse<any>>(`/issues/me`);

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
    throw new Error('Failed to fetch my issues');
  }
};

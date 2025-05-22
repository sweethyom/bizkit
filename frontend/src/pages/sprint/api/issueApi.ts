import {
  deleteIssue as deleteIssueEntity,
  getIssueDetail as getIssueDetailEntity,
  updateIssueAssignee as updateIssueAssigneeEntity,
  updateIssueBizPoint,
  updateIssueComponent as updateIssueComponentEntity,
  updateIssueContent as updateIssueContentEntity,
  updateIssueImportance as updateIssueImportanceEntity,
  updateIssueName as updateIssueNameEntity,
  updateIssueStatus as updateIssueStatusEntity,
} from '@/entities/issue';
import { Issue } from '@/pages/sprint/model/types';
import { api, ApiResponse } from '@/shared/api';

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

// 이슈의 스프린트 변경 - API 명세: PATCH /issues/{issueId}/sprint
export const updateIssueSprint = async (
  issueId: string,
  sprintId: string | null,
): Promise<void> => {
  try {
    // 실제 API 호출
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/sprint`, { sprintId });

    if (response.data.result !== 'SUCCESS') {
      throw new Error(`Failed to update issue sprint to ${sprintId}`);
    }
  } catch (error) {
    console.error(`[API] 이슈 스프린트 변경 실패:`, error);
    throw error;
  }
};

// 스프린트 내 이슈 이동 - API 명세: PATCH /sprints/{sprintId}/moveIssues
export const moveIssue = async (
  sprintId: string,
  moveIssueId: string,
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE', // API 형식으로 전달
  componentId?: string,
  beforeIssuePosition?: number | null,
  afterIssuePosition?: number | null,
): Promise<void> => {
  try {
    if (!sprintId || !moveIssueId) {
      throw new Error('스프린트 ID와 이슈 ID는 필수입니다');
    }

    // API 요청 데이터 구성
    const requestData: any = {
      moveIssueId: Number(moveIssueId),
    };

    // 선택적 파라미터 추가
    if (componentId) {
      requestData.componentId = Number(componentId);
    }

    if (status) {
      requestData.status = status;
    }

    // position 관련 데이터 처리
    if (beforeIssuePosition !== undefined && beforeIssuePosition !== null) {
      requestData.beforeIssuePosition = beforeIssuePosition;
    }

    if (afterIssuePosition !== undefined && afterIssuePosition !== null) {
      requestData.afterIssuePosition = afterIssuePosition;
    }

    // API 호출 시도
    try {
      const response = await api.patch<ApiResponse<void>>(
        `/sprints/${sprintId}/moveIssues`,
        requestData,
      );

      if (response.data.result === 'SUCCESS') {
        return;
      }
    } catch (apiError: any) {
      // 오류 코드가 S010인 경우 (옮기려는 이슈가 해당 스프린트에 없음)
      if (apiError.response?.data?.error?.code === 'S010') {
        // 대체 방식으로 처리
      } else {
        throw apiError; // 다른 오류는 그대로 전파
      }
    }

    // 직접 API 호출 방식 (moveIssues API 실패 시)
    // 1. 필요시 상태 변경
    if (status) {
      const clientStatus =
        status === 'TODO' ? 'todo' : status === 'IN_PROGRESS' ? 'inProgress' : 'done';

      await updateIssueStatus(moveIssueId, clientStatus as 'todo' | 'inProgress' | 'done');
    }

    // 2. 필요시 컴포넌트 변경
    if (componentId) {
      await updateIssueComponent(moveIssueId, componentId);
    }
  } catch (error: any) {
    console.error(`[API] 이슈 이동 오류:`, error);
    throw error;
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

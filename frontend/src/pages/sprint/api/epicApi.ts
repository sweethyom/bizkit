import { api, ApiResponse } from '@/shared/api';
import { Issue } from '@/pages/sprint/model/types';
import { updateIssueEpicEntity } from '@/entities/issue';

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

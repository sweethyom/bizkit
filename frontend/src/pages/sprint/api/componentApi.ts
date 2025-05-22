import { api, ApiResponse } from '@/shared/api';
import { ComponentIssueGroup } from '@/pages/sprint/model/types';

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

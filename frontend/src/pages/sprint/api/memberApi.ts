import { api, ApiResponse } from '@/shared/api';

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

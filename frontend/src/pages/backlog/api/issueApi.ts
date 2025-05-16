import { Issue } from '@/entities/issue';
import { api, ApiResponse } from '@/shared/api';

export const getIssueList = async (of: 'epic' | 'sprint', id: number) => {
  const response = await api.get<ApiResponse<Issue[]>>(`/${of}s/${id}/issues`);
  return response.data;
};

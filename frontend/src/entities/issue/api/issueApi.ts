import { api, ApiResponse } from '@/shared/api';

interface CreateIssueResponse {
  id: number;
}

export const createIssue = async (epicId: number, issueName: string) => {
  const response = await api.post<ApiResponse<CreateIssueResponse>>(`/epics/${epicId}/issues`, {
    name: issueName,
  });

  return response.data;
};

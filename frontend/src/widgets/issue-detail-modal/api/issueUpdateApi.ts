import { api, ApiResponse } from '@/shared/api';

export const updateIssueName = async (issueId: number, name: string) => {
  try {
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/name`, { name });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateIssueContent = async (issueId: number, content: string) => {
  try {
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/content`, { content });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateIssueAssignee = async (issueId: number, assigneeId: number) => {
  try {
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/assignee`, {
      assigneeId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateIssueComponent = async (issueId: number, componentId: number) => {
  try {
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/component`, {
      componentId,
    });
    return response.data;
  } catch (error: any) {
    console.error(error.response.data);
    throw error;
  }
};

export const updateIssueBizPoint = async (issueId: number, bizPoint: number) => {
  try {
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/bizPoint`, {
      bizPoint,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateIssueImportance = async (issueId: number, issueImportance: 'HIGH' | 'LOW') => {
  try {
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/importance`, {
      issueImportance,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateIssueEpic = async (issueId: number, epicId: number) => {
  try {
    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/epic`, { epicId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateIssueStatus = async (
  issueId: number,
  issueStatus: 'TODO' | 'IN_PROGRESS' | 'DONE',
) => {
  try {
    console.log(issueStatus);

    const response = await api.patch<ApiResponse<void>>(`/issues/${issueId}/status`, {
      issueStatus,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

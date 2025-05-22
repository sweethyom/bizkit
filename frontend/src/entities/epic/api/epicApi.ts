import { api, ApiResponse } from '@/shared/api';
import { Epic } from '../model/epic';

interface CreateEpicResponse {
  id: number;
}

export const createEpic = async (projectId: number, epicName: string) => {
  try {
    const response = await api.post<ApiResponse<CreateEpicResponse>>(
      `/projects/${projectId}/epics`,
      {
        name: epicName,
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEpicList = async (projectId: number) => {
  try {
    const response = await api.get<ApiResponse<Epic[]>>(`/projects/${projectId}/epics`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEpic = async (epicId: number) => {
  try {
    const response = await api.delete<ApiResponse<void>>(`/epics/${epicId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

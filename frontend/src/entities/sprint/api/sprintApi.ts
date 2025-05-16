import { Sprint } from '@/entities/sprint';
import { ApiResponse, api } from '@/shared/api';

export const createSprint = async (projectId: number, sprintName: string) => {
  try {
    const response = await api.post<ApiResponse<Sprint>>(`/projects/${projectId}/sprints`, {
      name: sprintName,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSprintList = async (projectId: number) => {
  try {
    const response = await api.get<ApiResponse<Sprint[]>>(`/projects/${projectId}/sprints`);

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

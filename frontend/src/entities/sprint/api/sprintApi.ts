import { ApiResponse, api } from '@/shared/api';
import { Issue, Sprint } from '@/shared/model';

interface CreateSprintResponse {
  id: number;
}

export const sprintApi = {
  createSprint: async (projectId: number, sprintName: string, dueDate?: string) => {
    try {
      const response = await api.post<ApiResponse<CreateSprintResponse>>(
        `/projects/${projectId}/sprints`,
        {
          name: sprintName,
          dueDate,
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getSprintList: async (projectId: number) => {
    try {
      const response = await api.get<ApiResponse<Sprint[]>>(`/projects/${projectId}/sprints`);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  updateSprint: async (sprintId: number, sprintName: string) => {
    try {
      const response = await api.patch<ApiResponse<void>>(`/sprints/${sprintId}/name`, {
        name: sprintName,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteSprint: async (sprintId: number) => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/sprints/${sprintId}`, {
        data: {
          option: 'DELETE',
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  startSprint: async (sprintId: number, dueDate?: string) => {
    try {
      console.log(`[sprintApi.ts] Starting sprint ${sprintId} with due date: ${dueDate}`);
      const response = await api.patch<ApiResponse>(`/sprints/${sprintId}/start`, {
        dueDate,
      });

      console.log(`[sprintApi.ts] Sprint start response:`, response.data);

      return response.data;
    } catch (error) {
      console.error(`[sprintApi.ts] Error starting sprint:`, error);
      throw error;
    }
  },
  completeSprint: async (sprintId: number, toSprintId: number | null = null) => {
    try {
      const response = await api.patch<ApiResponse<void>>(`/sprints/${sprintId}/complete`, {
        id: toSprintId,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getSprintIssues: async (sprintId: number) => {
    try {
      const response = await api.get<ApiResponse<Issue[]>>(`/sprints/${sprintId}/issues`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

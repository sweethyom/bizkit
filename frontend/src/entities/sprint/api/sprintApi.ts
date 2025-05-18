import { Sprint } from '@/entities/sprint';
import { ApiResponse, api } from '@/shared/api';

interface CreateSprintResponse {
  id: number;
}

export const sprintApi = {
  createSprint: async (projectId: number, sprintName: string) => {
    try {
      const response = await api.post<ApiResponse<CreateSprintResponse>>(
        `/projects/${projectId}/sprints`,
        {
          name: sprintName,
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
  startSprint: async (sprintId: number) => {
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      // 한국 시간으로 변환
      const options = {
        timeZone: 'Asia/Seoul',
        year: 'numeric' as const,
        month: 'numeric' as const,
        day: 'numeric' as const,
      };
      const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(dueDate);

      const response = await api.patch<ApiResponse>(`/sprints/${sprintId}/start`, {
        dueDate: formattedDate.split('.').map(Number).slice(0, 3),
      });

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  completeSprint: async (sprintId: number, toSprintId: number | null = null) => {
    try {
      const data = toSprintId ? { id: toSprintId } : undefined;

      const response = await api.patch<ApiResponse<void>>(`/sprints/${sprintId}/complete`, {
        id: toSprintId,
      });

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

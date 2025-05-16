import { ProjectDetail, ProjectList } from '@/shared/model';
import { AxiosError } from 'axios';
import { api } from './instance';
import { ApiResponse } from './types';

type ProjectCreateResponse = {
  id: number;
};

export const projectApi = {
  createProject: async (name: string, key: string) => {
    try {
      const response = await api.post<ApiResponse<ProjectCreateResponse>>('/projects', {
        name: name,
        key: key,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        const errorCode = error.response?.data.error.code;
        const errorMessage = error.response?.data.message;

        return {
          result: 'ERROR',
          data: errorCode === 'P001' ? '이미 존재하는 프로젝트 키입니다.' : errorMessage,
        };
      }
    }
  },

  getProjectDetail: async (id: number) => {
    try {
      const response = await api.get<ApiResponse<ProjectDetail>>(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  getMyProjectList: async (
    cursor: number | null = null,
    sort: 'RECENT_VIEW' | 'OLD_VIEW' | 'NAME_DESC' | null = 'RECENT_VIEW',
  ) => {
    try {
      const url =
        cursor !== null && cursor !== undefined
          ? `/projects?cursor=${cursor}&sort=${sort}`
          : `/projects?sort=${sort}`;

      const response = await api.get<ApiResponse<ProjectList>>(url);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

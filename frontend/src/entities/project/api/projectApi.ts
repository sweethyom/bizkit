import { Project, ProjectList } from '@/entities/project';

import { api, ApiResponse } from '@/shared/api';

type ProjectCreateResponse = {
  id: number;
};

export const createProject = async (name: string, key: string) => {
  try {
    const response = await api.post<ApiResponse<ProjectCreateResponse>>('/projects', {
      name,
      key,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProjectList = async (
  cursor: number | null = null,
  sort: 'RECENT_VIEW' | 'OLD_VIEW' | 'NAME_DESC' | null = 'RECENT_VIEW',
) => {
  try {
    const url =
      cursor !== null && cursor !== undefined
        ? `/projects?cursor=${cursor}&sort=${sort}&pageSize=10`
        : `/projects?sort=${sort}&pageSize=10`;

    const response = await api.get<ApiResponse<ProjectList>>(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProjectDetail = async (id: number) => {
  try {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    window.location.href = '/my-works';
  }
};

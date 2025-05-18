import { Component } from '@/entities/component';
import { ApiResponse, api } from '@/shared/api';

export const getComponentList = async (projectId: number) => {
  const response = await api.get<ApiResponse<Component[]>>(`/projects/${projectId}/components`);
  return response.data;
};

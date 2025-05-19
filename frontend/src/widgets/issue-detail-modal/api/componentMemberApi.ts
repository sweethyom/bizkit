import { ApiResponse, api } from '@/shared/api';
import { Component, Member } from '../model/types';

export const getComponentList = async (projectId: number) => {
  const response = await api.get<ApiResponse<Component[]>>(`/projects/${projectId}/components`);
  return response.data;
};

export const getMemberList = async (projectId: number) => {
  const response = await api.get(`projects/${projectId}/members`);
  return response.data;
};

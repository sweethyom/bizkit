import { api } from '@/shared/api';

export const getMemberList = async (projectId: number) => {
  const response = await api.get(`projects/${projectId}/members`);
  return response.data;
};

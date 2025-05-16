import { Issue } from '@/pages/backlog/model/issue';
import { ApiResponse } from '@/shared/api';
import axios from 'axios';

export const epicApi = {
  getIssues: async (epicId: number) => {
    // const response = await api.get(`/epics/${epicId}/issues`);

    const response = await axios.get<ApiResponse<Issue[]>>(
      'https://dummyjson.com/c/1da2-78ed-4720-817b',
    );

    response.data.data?.forEach((issue) => {
      issue.id = Number(epicId.toString() + issue.id.toString());
    });

    return response.data;
  },
};

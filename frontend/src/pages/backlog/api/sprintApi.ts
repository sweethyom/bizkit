import { Issue } from '@/pages/backlog/model/issue';
import { api, ApiResponse } from '@/shared/api';
import axios from 'axios';

export const sprintApi = {
  startSprint: async (sprintId: number) => {
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

    const response = await api.patch<ApiResponse>(`sprints/${sprintId}/start`, {
      dueDate: formattedDate.split('.').map(Number).slice(0, 3),
    });

    console.log(response.data);

    return response.data;
  },

  getIssues: async (sprintId: number) => {
    const response = await axios.get<ApiResponse<Issue[]>>(
      `https://dummyjson.com/c/bc06-f0e2-4832-8b5a`,
    );
    response.data.data?.forEach((issue) => {
      issue.id = Number(sprintId.toString() + issue.id.toString());
    });
    return response.data;
  },
};

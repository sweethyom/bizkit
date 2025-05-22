import { api } from '@/shared/api';

export const issueApi = {
  getIssuesByStatus: async (
    status: 'TODO' | 'IN_PROGRESS',
    cursorId: number | null = null,
    pageSize: number = 10,
  ) => {
    const url =
      cursorId === null || cursorId === undefined
        ? `/issues/me?issueStatus=${status}&pageSize=${pageSize}`
        : `/issues/me?issueStatus=${status}&cursorId=${cursorId}&pageSize=${pageSize}`;

    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(error);
      return { result: 'ERROR', data: [] };
    }
  },
};

import { Issue } from '@/entities/issue';
import { useCallback, useEffect, useState } from 'react';
import { issueApi } from '../api/issueApi';

export const useIssues = () => {
  const [todo, setTodo] = useState<Issue[]>([]);
  const [inProgress, setInProgress] = useState<Issue[]>([]);

  const getTodoIssues = useCallback(async () => {
    const response = await issueApi.getIssuesByStatus('TODO');
    if (response.result === 'SUCCESS') {
      setTodo(response.data);
    }
  }, []);

  const getInProgressIssues = useCallback(async () => {
    const response = await issueApi.getIssuesByStatus('IN_PROGRESS');
    if (response.result === 'SUCCESS') {
      setInProgress(response.data);
    }
  }, []);

  useEffect(() => {
    getTodoIssues();
    getInProgressIssues();
  }, [getTodoIssues, getInProgressIssues]);

  return { todo, inProgress };
};

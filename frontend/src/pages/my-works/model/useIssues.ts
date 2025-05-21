import { Issue } from '@/entities/issue';
import { useCallback, useEffect, useState } from 'react';
import { issueApi } from '../api/issueApi';

const PAGE_SIZE = 10;

export const useIssues = () => {
  const [todo, setTodo] = useState<Issue[]>([]);
  const [inProgress, setInProgress] = useState<Issue[]>([]);

  const [todoCursorId, setTodoCursor] = useState<number | null>(null);
  const [inProgressCursorId, setInProgressCursor] = useState<number | null>(null);

  const [hasMoreTodo, setHasMoreTodo] = useState(true);
  const [hasMoreInProgress, setHasMoreInProgress] = useState(true);

  const getTodoIssues = useCallback(
    async (cursorId: number | null) => {
      if (!hasMoreTodo) return;
      const response = await issueApi.getIssuesByStatus('TODO', cursorId, PAGE_SIZE);
      if (response.result === 'SUCCESS') {
        setTodo([...todo, ...response.data]);
        if (response.data.length > 0) {
          setTodoCursor(response.data[response.data.length - 1].id);
        }
        if (response.data.length < PAGE_SIZE) {
          setHasMoreTodo(false);
        }
      }
    },
    [todo, hasMoreTodo],
  );

  const getInProgressIssues = useCallback(
    async (cursorId: number | null) => {
      if (!hasMoreInProgress) return;
      const response = await issueApi.getIssuesByStatus('IN_PROGRESS', cursorId, PAGE_SIZE);
      if (response.result === 'SUCCESS') {
        setInProgress([...inProgress, ...response.data]);
        if (response.data.length > 0) {
          setInProgressCursor(response.data[response.data.length - 1].id);
        }
        if (response.data.length < PAGE_SIZE) {
          setHasMoreInProgress(false);
        }
      }
    },
    [inProgress, hasMoreInProgress],
  );

  useEffect(() => {
    getTodoIssues(todoCursorId);
    getInProgressIssues(inProgressCursorId);
  }, []);

  return {
    todo,
    inProgress,
    todoCursorId,
    inProgressCursorId,
    hasMoreTodo,
    hasMoreInProgress,
    getTodoIssues,
    getInProgressIssues,
  };
};

import { getSprintList } from '@/entities/sprint/api/sprintApi';
import { useCallback, useEffect, useState } from 'react';
import { useSprintStore } from './useSprintStore';

export const useSprint = (projectId: number) => {
  const { sprints, setSprints } = useSprintStore();
  const [isLoading, setIsLoading] = useState(true);

  const loadSprints = useCallback(async () => {
    if (!Number.isInteger(projectId)) return;

    try {
      setIsLoading(true);
      const response = await getSprintList(projectId);
      setSprints(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, setSprints]);

  useEffect(() => {
    loadSprints();
  }, [loadSprints]);

  return { sprints, isLoading };
};

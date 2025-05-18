import { sprintApi } from '@/entities/sprint/api/sprintApi';
import { useCallback, useEffect, useState } from 'react';
import { SprintStatus } from '../model/sprint';
import { useSprintStore } from './useSprintStore';

export const useSprint = (projectId: number) => {
  const { sprints, setSprints, updateSprintStatus } = useSprintStore();
  const [isLoading, setIsLoading] = useState(true);

  const loadSprints = useCallback(async () => {
    if (!Number.isInteger(projectId)) return;

    try {
      setIsLoading(true);
      const response = await sprintApi.getSprintList(projectId);
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

  const startSprint = useCallback(
    async (sprintId: number) => {
      try {
        await sprintApi.startSprint(sprintId);
        updateSprintStatus(sprintId, SprintStatus.ONGOING);
      } catch (error) {
        console.error(error);
      }
    },
    [updateSprintStatus],
  );

  const completeSprint = useCallback(
    async (sprintId: number, toSprintId: number | null) => {
      try {
        await sprintApi.completeSprint(sprintId, toSprintId);
        updateSprintStatus(sprintId, SprintStatus.COMPLETED);
      } catch (error) {
        console.log(error);
      }
    },
    [updateSprintStatus],
  );

  return { sprints, isLoading, startSprint, completeSprint };
};

import { SprintStatus } from '@/entities/sprint';
import { sprintApi } from '@/entities/sprint/api/sprintApi';

import { getFormattedDate } from '@/shared/lib';
import { Issue } from '@/shared/model';

import { useSprintStore } from './useSprintStore';

import { useCallback, useEffect, useState } from 'react';

export const useSprint = (projectId: number) => {
  const { sprints, setSprints, updateSprintStatus, updateSprint } = useSprintStore();
  const [isLoading, setIsLoading] = useState(true);

  const [startSprintError, setStartSprintError] = useState<{
    sprintId: number;
    message: string;
    invalidIssues: Issue[];
  } | null>(null);

  useEffect(() => {
    if (startSprintError) {
      const timer = setTimeout(() => {
        setStartSprintError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [startSprintError]);

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

  const validateSprint = useCallback(async (sprintId: number) => {
    const { data: issues } = await sprintApi.getSprintIssues(sprintId);

    const invalidIssues = (issues || []).filter((issue: any) => {
      return (
        !issue.name ||
        !issue.bizPoint ||
        !issue.issueImportance ||
        !issue.issueStatus ||
        !issue.component.id ||
        !issue.user.id
      );
    });

    if (invalidIssues.length > 0) {
      setStartSprintError({
        sprintId,
        message: '스프린트 내 모든 이슈의 정보가 입력되어 있어야 합니다. 누락된 이슈가 있습니다.',
        invalidIssues,
      });

      return false;
    }

    return true;
  }, []);

  const startSprint = useCallback(
    async (sprintId: number, dueDate: string) => {
      try {
        const response = await sprintApi.startSprint(sprintId, dueDate);
        console.log(`[useSprint.ts] API response for startSprint:`, response);
        const sprint = sprints.find((s) => s.id === sprintId);
        if (sprint) {
          sprint.sprintStatus = SprintStatus.ONGOING;
          sprint.startDate = getFormattedDate(new Date());
          sprint.dueDate = dueDate || null;
          updateSprint(sprint);
          // updateSprintStatus(sprintId, SprintStatus.ONGOING);
        }
      } catch (error) {
        console.error(`[useSprint.ts] Error starting sprint:`, error);
      }
    },
    [sprints, updateSprint],
  );

  const completeSprint = useCallback(
    async (sprintId: number, toSprintId: number | null) => {
      try {
        await sprintApi.completeSprint(sprintId, toSprintId);
        const sprint = sprints.find((s) => s.id === sprintId);

        if (!sprint) return;

        sprint.sprintStatus = SprintStatus.COMPLETED;
        sprint.completedDate = getFormattedDate(new Date());

        updateSprint(sprint);
      } catch (error) {
        console.log(error);
      }
    },
    [updateSprint, sprints],
  );

  return {
    sprints,
    isLoading,
    startSprintError,
    validateSprint,
    startSprint,
    completeSprint,
    setSprints,
    setStartSprintError,
  };
};

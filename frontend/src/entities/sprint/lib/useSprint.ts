import { SprintStatus } from '@/entities/sprint';
import { sprintApi } from '@/entities/sprint/api/sprintApi';

import { Issue } from '@/shared/model';

import { useSprintStore } from './useSprintStore';

import { useCallback, useEffect, useState } from 'react';

export const useSprint = (projectId: number) => {
  const { sprints, setSprints, updateSprintStatus } = useSprintStore();
  const [isLoading, setIsLoading] = useState(true);

  const [startSprintError, setStartSprintError] = useState<{
    sprintId: number;
    message: string;
    invalidIssues: Issue[];
  } | null>(null);

  useEffect(() => {
    if (startSprintError) {
      alert(startSprintError.message);

      const timer = setTimeout(() => {
        setStartSprintError(null);
      }, 3000);

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
    async (sprintId: number, dueDate?: string) => {
      try {
        await sprintApi.startSprint(sprintId, dueDate);
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

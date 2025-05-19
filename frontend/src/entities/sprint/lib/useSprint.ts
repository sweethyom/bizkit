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
    async (sprintId: number, dueDate?: string) => {
      try {
        // 1. 스프린트 이슈 목록 조회
        const { data: issues } = await sprintApi.getSprintIssues(sprintId);
        // 2. 필수값 검증 (content 제외)
        const invalidIssues = (issues || []).filter((issue: any) => {
          // 필수값: id, name, key, bizPoint, issueImportance, issueStatus, component(id, name), assignee(id, nickname)
          console.log(issue);
          if (
            !issue.name ||
            typeof issue.bizPoint !== 'number' ||
            issue.bizPoint <= 0 ||
            !issue.issueImportance ||
            !issue.issueStatus ||
            !issue.component.id ||
            !issue.user.id
          ) {
            return true;
          }
          return false;
        });

        console.log(invalidIssues);
        if (invalidIssues.length > 0) {
          window.alert(
            '스프린트 내 모든 이슈의 정보가 입력되어 있어야 합니다. 누락된 이슈가 있습니다.',
          );
          return;
        }
        // 3. 정상일 때만 스프린트 시작
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

  return { sprints, isLoading, startSprint, completeSprint, setSprints };
};

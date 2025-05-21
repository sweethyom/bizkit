import { deleteIssue as apiDeleteIssue } from '@/pages/sprint/api/issueApi';
import { getOngoingSprintComponentIssues, getProjectSprints } from '@/pages/sprint/api/sprintApi';
import { Issue, SprintData } from '@/pages/sprint/model/types';
import { useCallback, useEffect, useState } from 'react';
import { createEmptySprintData, transformApiResponseToSprintData } from '../lib/transformers';

/**
 * 스프린트 보드 데이터 관리 훅
 */
export const useSprintBoardData = (projectId?: string) => {
  const [sprintData, setSprintData] = useState<SprintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드 함수
  const loadSprintData = useCallback(async () => {
    try {
      if (!projectId) {
        throw new Error('Project ID is missing');
      }

      localStorage.setItem('currentProjectId', projectId);

      // 성능 향상을 위해 프로젝트의 스프린트 상태 확인
      try {
        const sprints = await getProjectSprints(projectId);
        const hasActiveSprint = sprints.some(
          (sprint) => sprint.sprintStatus === 'ONGOING' || sprint.status === 'ONGOING',
        );
        const hasReadySprints = sprints.some(
          (sprint) => sprint.sprintStatus === 'READY' || sprint.status === 'READY',
        );

        if (!hasActiveSprint) {
          setSprintData(createEmptySprintData());
          if (hasReadySprints) {
            setError(
              '준비된 스프린트가 있지만 활성화되지 않았습니다. 스택 페이지에서 스프린트를 시작해 주세요.',
            );
          } else {
            setError(
              '현재 프로젝트에 진행 중인 스프린트가 존재하지 않습니다. 스택 페이지에서 스프린트를 먼저 생성해주세요.',
            );
          }
          setLoading(false);
          return;
        }

        // 컴포넌트별 이슈 조회 전략 사용 - 컴포넌트 목록 기반
        const componentIssueGroups = await getOngoingSprintComponentIssues(projectId);

        const convertedData = transformApiResponseToSprintData(componentIssueGroups);
        setSprintData(convertedData);

        if (!componentIssueGroups || componentIssueGroups.length === 0) {
          // 활성 스프린트가 있지만 이슈가 없는 경우 - 오류가 아니라 정보 메시지
          setError(
            '현재 활성 스프린트에는 이슈가 없습니다. 백로그에서 이슈를 스프린트로 추가해 보세요.',
          );
        } else {
          setError(null);
        }
      } catch (err: any) {
        console.error('[useSprintBoardData.ts] Error details:', err);

        setSprintData(createEmptySprintData());

        if (
          err?.message?.includes('No sprint found') ||
          err?.message?.includes('sprint not found')
        ) {
          setError(
            '현재 프로젝트에 진행 중인 스프린트가 존재하지 않습니다. 스프린트를 먼저 생성해주세요.',
          );
        } else {
          setError('스프린트 데이터를 불러오는 중 오류가 발생했습니다.');
        }
      }
    } catch (err: any) {
      console.error('[useSprintBoardData.ts] Error details:', err);

      if (err?.message?.includes('Project ID is missing')) {
        setError('프로젝트 ID가 없습니다.');
      } else {
        setError('스프린트 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 초기 데이터 로드
  useEffect(() => {
    loadSprintData();
  }, [loadSprintData]);

  // 이슈 업데이트 함수
  const updateIssue = useCallback(
    (updatedIssue: Issue) => {
      if (!sprintData) return;

      const updatedStatusGroups = sprintData.statusGroups.map((statusGroup) => {
        const updatedComponentGroups = statusGroup.componentGroups.map((componentGroup) => {
          const updatedIssues = componentGroup.issues.map((issue) => {
            if (issue.id === updatedIssue.id) {
              return updatedIssue;
            }
            return issue;
          });

          return {
            ...componentGroup,
            issues: updatedIssues,
          };
        });

        return {
          ...statusGroup,
          componentGroups: updatedComponentGroups,
        };
      });

      setSprintData({
        ...sprintData,
        statusGroups: updatedStatusGroups,
      });
    },
    [sprintData],
  );

  // 이슈 삭제 함수
  const deleteIssue = useCallback(
    async (issueId: string) => {
      if (!sprintData) return;

      try {
        await apiDeleteIssue(issueId);

        const updatedStatusGroups = sprintData.statusGroups.map((statusGroup) => {
          const updatedComponentGroups = statusGroup.componentGroups.map((componentGroup) => {
            return {
              ...componentGroup,
              issues: componentGroup.issues.filter((issue) => issue.id !== issueId),
            };
          });

          return {
            ...statusGroup,
            componentGroups: updatedComponentGroups,
          };
        });

        setSprintData({
          ...sprintData,
          statusGroups: updatedStatusGroups,
        });
      } catch (err) {
        console.error('이슈 삭제 실패:', err);
      }
    },
    [sprintData],
  );

  return {
    sprintData,
    loading,
    error,
    updateIssue,
    deleteIssue,
    refreshData: loadSprintData,
  };
};

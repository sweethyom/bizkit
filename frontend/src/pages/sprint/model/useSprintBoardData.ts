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
      setLoading(true);
      console.log(
        `[useSprintBoardData] 활성 스프린트 데이터 로드 시작 - 프로젝트 ID: ${projectId}`,
      );

      // 성능 향상을 위해 프로젝트의 스프린트 상태 확인
      try {
        const sprints = await getProjectSprints(projectId);
        const activeSprint = sprints.find(
          (sprint) => sprint.sprintStatus === 'ONGOING' || sprint.status === 'ONGOING',
        );
        const hasActiveSprint = activeSprint !== undefined;
        const hasReadySprints = sprints.some(
          (sprint) => sprint.sprintStatus === 'READY' || sprint.status === 'READY',
        );

        console.log(
          `[useSprintBoardData] 활성 스프린트 확인: ${hasActiveSprint}, 준비 스프린트 확인: ${hasReadySprints}`,
        );

        // 활성 스프린트 ID 로깅
        if (activeSprint) {
          console.log(`[useSprintBoardData] 활성 스프린트 ID: ${activeSprint.id}`);
        }

        if (!hasActiveSprint) {
          setSprintData(createEmptySprintData(activeSprint?.id?.toString() || null));
          if (hasReadySprints) {
            setError(
              '준비된 스프린트가 있지만, 시작되지 않았습니다. 스택 페이지에서 스프린트를 시작해 주세요.',
            );
          } else {
            setError(
              '현재 프로젝트에 진행 중인 스프린트가 존재하지 않습니다. 스프린트를 먼저 생성해주세요.',
            );
          }
          setLoading(false);
          return;
        }

        // 컴포넌트별 활성 스프린트 이슈 수집 - 개선된 방식 적용
        console.log(`[useSprintBoardData] 컴포넌트별 이슈 조회 시작 - 프로젝트 ID: ${projectId}`);
        const componentIssueGroups = await getOngoingSprintComponentIssues(projectId);
        console.log('[useSprintBoardData] 컴포넌트별 이슈 응답 데이터:', componentIssueGroups);

        const convertedData = transformApiResponseToSprintData(componentIssueGroups);

        // 활성 스프린트 ID 설정
        if (activeSprint) {
          convertedData.sprintId = activeSprint.id.toString();
          console.log(`[useSprintBoardData] 활성 스프린트 ID 설정: ${convertedData.sprintId}`);
        }

        console.log('[useSprintBoardData] 변환된 데이터:', convertedData);
        setSprintData(convertedData);

        // 이슈 유무 확인 - 개선된 방식
        let totalIssueCount = 0;
        let hasIssuesInAnyComponent = false;

        // 1. API 응답 원본 데이터에서 이슈 개수 확인
        if (componentIssueGroups && componentIssueGroups.length > 0) {
          componentIssueGroups.forEach((group) => {
            if (group.issues && Array.isArray(group.issues) && group.issues.length > 0) {
              totalIssueCount += group.issues.length;
              hasIssuesInAnyComponent = true;
            }
          });
        }
        console.log(
          `[useSprintBoardData] API 응답의 총 이슈 개수: ${totalIssueCount}, 이슈 있음: ${hasIssuesInAnyComponent}`,
        );

        // 2. 변환된 UI 데이터에서도 이슈 개수 확인 (이중 검증)
        let uiIssueCount = 0;
        let hasIssuesInUI = false;
        if (convertedData && convertedData.statusGroups) {
          convertedData.statusGroups.forEach((statusGroup) => {
            statusGroup.componentGroups.forEach((compGroup) => {
              if (
                compGroup.issues &&
                Array.isArray(compGroup.issues) &&
                compGroup.issues.length > 0
              ) {
                uiIssueCount += compGroup.issues.length;
                hasIssuesInUI = true;
              }
            });
          });
        }
        console.log(
          `[useSprintBoardData] UI 데이터의 총 이슈 개수: ${uiIssueCount}, 이슈 있음: ${hasIssuesInUI}`,
        );

        // 3. 최종 판단 - 어느 쪽 데이터든 이슈가 있으면 정상 표시
        const hasAnyIssues = hasIssuesInAnyComponent || hasIssuesInUI;

        if (!hasAnyIssues) {
          // 활성 스프린트가 있지만 이슈가 없는 경우 - 오류가 아니라 정보 메시지
          setError(
            '현재 활성 스프린트에는 이슈가 없습니다. 스택에서 이슈를 스프린트로 추가해 보세요.',
          );
        } else {
          setError(null);
        }
      } catch (err: any) {
        console.error('[useSprintBoardData.ts] 데이터 로드 오류:', err);

        setSprintData(createEmptySprintData(null));

        if (
          err?.message?.includes('No sprint found') ||
          err?.message?.includes('sprint not found')
        ) {
          setError(
            '현재 프로젝트에 활성 스프린트가 존재하지 않습니다. 스프린트를 먼저 생성해주세요.',
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

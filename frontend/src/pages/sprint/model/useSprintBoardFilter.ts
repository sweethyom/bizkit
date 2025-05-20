import { useCallback, useState, useMemo } from 'react';
import { SprintData } from '@/pages/sprint/model/types';
import { extractUniqueComponents, extractUniqueAssignees } from '../lib/helpers';

/**
 * 스프린트 보드 필터링 관련 훅
 */
export const useSprintBoardFilter = (sprintData: SprintData | null) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // 컴포넌트 목록 (중복 제거)
  const allComponents = useMemo(() => {
    return sprintData ? extractUniqueComponents(sprintData) : [];
  }, [sprintData]);

  // 모든 이슈에서 담당자 목록 추출 (중복 제거)
  const allAssignees = useMemo(() => {
    return sprintData ? extractUniqueAssignees(sprintData) : [];
  }, [sprintData]);

  // 필터 이름 추출
  const getFilterName = useCallback(() => {
    if (!activeFilter) return null;

    if (activeFilter.startsWith('component-')) {
      const componentName = activeFilter.replace('component-', '');
      return `컴포넌트: ${componentName}`;
    } else if (activeFilter.startsWith('assignee-')) {
      const assigneeName = activeFilter.replace('assignee-', '');
      return `담당자: ${assigneeName || '없음'}`;
    }
    return null;
  }, [activeFilter]);

  // 필터링된 이슈 총 개수 계산
  const getTotalFilteredIssuesCount = useCallback(() => {
    if (!sprintData || !activeFilter) return 0;

    let count = 0;
    sprintData.statusGroups.forEach((statusGroup) => {
      statusGroup.componentGroups.forEach((componentGroup) => {
        if (activeFilter.startsWith('component-')) {
          const filterComponent = activeFilter.replace('component-', '');
          if (componentGroup.name === filterComponent) {
            count += componentGroup.issues.length;
          }
        } else if (activeFilter.startsWith('assignee-')) {
          const filterAssignee = activeFilter.replace('assignee-', '');
          count += componentGroup.issues.filter((issue) => {
            if (typeof issue.assignee === 'string') {
              return issue.assignee === filterAssignee;
            } else if (issue.assignee && issue.assignee.nickname) {
              return issue.assignee.nickname === filterAssignee;
            }
            return false;
          }).length;
        }
      });
    });

    return count;
  }, [sprintData, activeFilter]);

  // 필터링된 스프린트 데이터 얻기
  const getFilteredSprintData = useCallback(() => {
    if (!sprintData) return null;
    if (!activeFilter) return sprintData;

    // 스프린트 데이터의 깊은 복사본 생성
    const filteredSprintData = JSON.parse(JSON.stringify(sprintData)) as SprintData;

    // 각 상태 그룹을 순회하며 필터링
    filteredSprintData.statusGroups = filteredSprintData.statusGroups.map((statusGroup) => {
      // 각 컴포넌트 그룹에 대한 필터링된 사본 생성
      const filteredComponentGroups = statusGroup.componentGroups.map((componentGroup) => {
        // 컴포넌트 필터가 활성화된 경우
        if (activeFilter.startsWith('component-')) {
          const filterComponent = activeFilter.replace('component-', '');
          // 컴포넌트 이름이 필터와 일치하지 않으면 빈 이슈 배열 반환
          if (componentGroup.name !== filterComponent) {
            return { ...componentGroup, issues: [] };
          }
          // 일치하는 경우 원래 컴포넌트 그룹 반환
          return componentGroup;
        }

        // 담당자 필터가 활성화된 경우
        if (activeFilter.startsWith('assignee-')) {
          const filterAssignee = activeFilter.replace('assignee-', '');

          // 이슈 중 담당자가 필터와 일치하는 것만 유지
          const filteredIssues = componentGroup.issues.filter((issue) => {
            if (typeof issue.assignee === 'string') {
              return issue.assignee === filterAssignee;
            } else if (issue.assignee && issue.assignee.nickname) {
              return issue.assignee.nickname === filterAssignee;
            }
            return false;
          });

          return {
            ...componentGroup,
            issues: filteredIssues,
          };
        }

        // 다른 필터의 경우 기본값 반환
        return componentGroup;
      });

      return {
        ...statusGroup,
        componentGroups: filteredComponentGroups,
      };
    });

    return filteredSprintData;
  }, [sprintData, activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    allComponents,
    allAssignees,
    getFilterName,
    getTotalFilteredIssuesCount,
    getFilteredSprintData
  };
};

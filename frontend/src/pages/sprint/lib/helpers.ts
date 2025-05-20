import { SprintData } from '../model/types';

/**
 * 스프린트 데이터에서 고유한 컴포넌트 목록 추출
 */
export const extractUniqueComponents = (sprintData: SprintData): string[] => {
  if (!sprintData) return [];
  
  return Array.from(
    new Set(
      sprintData.statusGroups.flatMap((statusGroup) =>
        statusGroup.componentGroups.map((componentGroup) => componentGroup.name),
      ),
    ),
  );
};

/**
 * 스프린트 데이터에서 고유한 담당자 목록 추출
 */
export const extractUniqueAssignees = (sprintData: SprintData): string[] => {
  if (!sprintData) return [];
  
  return Array.from(
    new Set(
      sprintData.statusGroups.flatMap((statusGroup) =>
        statusGroup.componentGroups.flatMap((componentGroup) =>
          componentGroup.issues.map((issue) => {
            if (typeof issue.assignee === 'string') {
              return issue.assignee;
            } else if (issue.assignee && issue.assignee.nickname) {
              return issue.assignee.nickname;
            }
            return '';
          }),
        ),
      ),
    ),
  ).filter((assignee) => assignee !== undefined && assignee !== null && assignee !== ''); // 빈 값 제거
};

/**
 * 컴포넌트별 이슈 총 개수를 계산
 */
export const getComponentIssueCounts = (sprintData: SprintData): { [key: string]: number } => {
  if (!sprintData) return {};

  const counts: { [key: string]: number } = {};

  sprintData.statusGroups.forEach((statusGroup) => {
    statusGroup.componentGroups.forEach((componentGroup) => {
      if (!counts[componentGroup.name]) {
        counts[componentGroup.name] = 0;
      }
      counts[componentGroup.name] = Math.max(
        counts[componentGroup.name],
        componentGroup.issues.length,
      );
    });
  });

  return counts;
};

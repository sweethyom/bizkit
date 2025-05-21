import { ComponentIssueGroup, SprintData } from '../model/types';

/**
 * API 응답 데이터를 SprintData 형식으로 변환
 */
export const transformApiResponseToSprintData = (
  componentIssueGroups: ComponentIssueGroup[] | null,
): SprintData => {
  // 기본 스프린트 구조 생성
  const convertedData: SprintData = {
    sprintId: null, // 스프린트 ID는 외부에서 설정
    statusGroups: [
      {
        id: 'todo',
        status: 'todo',
        title: '해야 할 일',
        componentGroups: [],
      },
      {
        id: 'inProgress',
        status: 'inProgress',
        title: '진행 중',
        componentGroups: [],
      },
      {
        id: 'done',
        status: 'done',
        title: '완료',
        componentGroups: [],
      },
    ],
  };

  // 필수 기본 컴포넌트 그룹 추가 (API 응답이 비어있을 때도 처리)
  const allComponentsMap = new Map<string, string>();

  // API 응답에 데이터가 있는 경우 컴포넌트 추출
  if (componentIssueGroups && componentIssueGroups.length > 0) {
    // 각 상태그룹별로 이슈를 순회하며 모든 컴포넌트 정보 수집
    componentIssueGroups.forEach((group) => {
      if (!group.issues || !Array.isArray(group.issues)) {
        return;
      }

      group.issues.forEach((issue) => {
        if (issue.component) {
          // 컴포넌트 정보 추출 시도
          let componentId = '';
          let componentName = '';

          // 1. 컴포넌트가 객체인 경우
          if (typeof issue.component === 'object' && issue.component !== null) {
            if (issue.component.id) {
              componentId = issue.component.id.toString();
              componentName = issue.component.name || '';
            }
          }
          // 2. 컴포넌트가 문자열인 경우
          else if (typeof issue.component === 'string') {
            // 같은 이름의 컴포넌트가 이미 맵에 있는지 확인
            const existingEntry = Array.from(allComponentsMap.entries()).find(
              ([_, name]) => name === issue.component,
            );

            if (existingEntry) {
              componentId = existingEntry[0];
              componentName = existingEntry[1];

              // 이름 기반 안정적인 해시 생성
              const hash = String(issue.component)
                .split('')
                .reduce((acc, char) => {
                  return (acc * 31 + char.charCodeAt(0)) & 0xffffffff;
                }, 0);

              componentId = `comp-${hash.toString()}`;
              componentName = String(issue.component);
            }
          }

          // 유효한 컴포넌트만 맵에 추가
          if (componentId && componentName) {
            if (!allComponentsMap.has(componentId)) {
              allComponentsMap.set(componentId, componentName);
            }
          }
        }
      });
    });
  }

  // 컴포넌트가 하나도 없는 경우 처리 - 기본 컴포넌트 추가
  if (allComponentsMap.size === 0) {
    // 기본 컴포넌트 그룹 생성
    allComponentsMap.set('1', '컴포넌트1');
  }

  // 각 상태 그룹에 컴포넌트 그룹 초기화
  convertedData.statusGroups.forEach((statusGroup) => {
    allComponentsMap.forEach((componentName, componentId) => {
      statusGroup.componentGroups.push({
        id: componentId,
        name: componentName,
        isExpanded: true,
        issues: [],
      });
    });
  });

  // API 응답에 데이터가 있는 경우에만 이슈를 할당
  if (componentIssueGroups && componentIssueGroups.length > 0) {
    // 총 이슈 개수 계산 및 로깅
    let totalIssuesCount = 0;
    componentIssueGroups.forEach((group) => {
      if (group.issues && Array.isArray(group.issues)) {
        totalIssuesCount += group.issues.length;
      }
    });

    // 이슈가 있는 경우에만 처리 진행
    if (totalIssuesCount > 0) {
      // 각 상태그룹별로 처리
      componentIssueGroups.forEach((group) => {
        // issueStatus를 소문자 및 camelCase로 변환 (TODO -> todo, IN_PROGRESS -> inProgress)
        const statusKey =
          group.issueStatus === 'TODO'
            ? 'todo'
            : group.issueStatus === 'IN_PROGRESS'
              ? 'inProgress'
              : 'done';

        // 해당 상태 그룹 찾기
        const statusGroup = convertedData.statusGroups.find((sg) => sg.status === statusKey);
        if (!statusGroup) {
          return;
        }

        // 각 이슈를 적절한 컴포넌트 그룹에 할당
        if (!group.issues || !Array.isArray(group.issues)) {
          return;
        }

        group.issues.forEach((issue) => {
          // 컴포넌트 ID 결정 로직
          let componentId = '';
          let componentName = '';

          if (issue.component) {
            // 컴포넌트가 객체인 경우
            if (typeof issue.component === 'object' && issue.component !== null) {
              if (issue.component.id) {
                componentId = issue.component.id.toString();
                componentName = issue.component.name || '';
              }
            }
            // 컴포넌트가 문자열인 경우
            else if (typeof issue.component === 'string') {
              // 이름을 기반으로 컴포넌트 찾기
              const foundEntry = Array.from(allComponentsMap.entries()).find(
                ([_, name]) => name === issue.component,
              );

              if (foundEntry) {
                componentId = foundEntry[0];
                componentName = foundEntry[1];
              } else {
                // 이름 기반 안정적인 해시 생성
                const hash = String(issue.component)
                  .split('')
                  .reduce((acc, char) => {
                    return (acc * 31 + char.charCodeAt(0)) & 0xffffffff;
                  }, 0);

                componentId = `comp-${hash.toString()}`;
                componentName = String(issue.component);

                // 새로 만든 컴포넌트도 컴포넌트 공간에 추가
                if (!allComponentsMap.has(componentId)) {
                  allComponentsMap.set(componentId, componentName);

                  // 새 컴포넌트를 모든 상태 그룹에 추가
                  convertedData.statusGroups.forEach((sg) => {
                    sg.componentGroups.push({
                      id: componentId,
                      name: componentName,
                      isExpanded: true,
                      issues: [],
                    });
                  });
                }
              }
            }
          } else {
            // 컴포넌트가 없는 경우 - 첫 번째 컴포넌트 사용 (기본 컴포넌트)
            const firstComponent = Array.from(allComponentsMap.entries())[0];
            if (firstComponent) {
              componentId = firstComponent[0];
              componentName = firstComponent[1];
            }
          }

          // 유효한 컴포넌트 ID인 경우만 처리
          if (componentId) {
            // 컴포넌트 그룹 찾기
            let componentGroup = statusGroup.componentGroups.find((cg) => cg.id === componentId);

            // 컴포넌트 그룹이 없는 경우 생성 (이중 확인)
            if (!componentGroup) {
              componentGroup = {
                id: componentId,
                name: componentName,
                isExpanded: true,
                issues: [],
              };
              statusGroup.componentGroups.push(componentGroup);
            }

            // 이슈 객체 상태 표준화 (API 응답에서 프론트엔드 모델로 변환)
            const formattedIssue = {
              id: issue.id.toString(),
              key: issue.key,
              title: issue.title || issue.name || '',
              epic: issue.epic
                ? typeof issue.epic === 'string'
                  ? issue.epic
                  : issue.epic.name || ''
                : '',
              // 컴포넌트 이름만 유지 (ID는 componentGroup에 이미 있음)
              component: componentName,
              assignee: issue.assignee || issue.user || null,
              storyPoints: issue.storyPoints || issue.bizPoint || 0,
              priority: (issue.priority === 'high' || issue.issueImportance === 'HIGH'
                ? 'high'
                : issue.priority === 'medium' || issue.issueImportance === 'MEDIUM'
                  ? 'medium'
                  : 'low') as 'low' | 'medium' | 'high',
              status: statusKey as 'todo' | 'inProgress' | 'done',
              description: issue.description || issue.content || '',
              sprint: issue.sprint?.name || '',
              // position 정보 추가 - API에서 제공되는 position 값을 우선적으로 사용
              position: issue.position !== undefined ? issue.position : null,
            };

            componentGroup.issues.push(formattedIssue);

            // position 값에 따라 이슈 정렬
            componentGroup.issues.sort((a, b) => {
              // position 값이 없는 경우 기본 순서 유지
              if (a.position === null && b.position === null) return 0;
              if (a.position === null) return 1; // position 값이 없는 것은 뒤로
              if (b.position === null) return -1; // position 값이 없는 것은 뒤로
              return a.position - b.position; // position 값에 따라 오름차순 정렬
            });
          } else {
          }
        });
      });
    }
  }

  // 최종 이슈 개수 확인
  let finalIssueCount = 0;
  convertedData.statusGroups.forEach((statusGroup) => {
    statusGroup.componentGroups.forEach((componentGroup) => {
      finalIssueCount += componentGroup.issues.length;
    });
  });

  return convertedData;
};

/**
 * 빈 스프린트 데이터를 생성
 * @param sprintId 스프린트 ID (없으면 null)
 */
export const createEmptySprintData = (sprintId: string | null): SprintData => {
  return {
    sprintId: sprintId,
    statusGroups: [
      {
        id: 'todo',
        status: 'todo',
        title: '해야 할 일',
        componentGroups: [],
      },
      {
        id: 'inProgress',
        status: 'inProgress',
        title: '진행 중',
        componentGroups: [],
      },
      {
        id: 'done',
        status: 'done',
        title: '완료',
        componentGroups: [],
      },
    ],
  };
};

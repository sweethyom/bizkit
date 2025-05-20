import { ComponentIssueGroup, SprintData } from '../model/types';

/**
 * API 응답 데이터를 SprintData 형식으로 변환
 */
export const transformApiResponseToSprintData = (componentIssueGroups: ComponentIssueGroup[] | null): SprintData => {
  // 기본 스프린트 구조 생성
  const convertedData: SprintData = {
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
    componentIssueGroups.forEach(group => {
      group.issues.forEach(issue => {
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
            const existingEntry = Array.from(allComponentsMap.entries())
              .find(([_, name]) => name === issue.component);
            
            if (existingEntry) {
              componentId = existingEntry[0];
              componentName = existingEntry[1];
            } else {
              // 이름 기반 안정적인 해시 생성
              const hash = issue.component.split('').reduce((acc, char) => {
                return (acc * 31 + char.charCodeAt(0)) & 0xFFFFFFFF;
              }, 0);
              
              componentId = `comp-${hash.toString()}`;
              componentName = issue.component;
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

  // 컴포넌트가 하나도 없는 경우 처리 - 빈 데이터 보여주기
  if (allComponentsMap.size === 0) {
    return createEmptySprintData();
  }

  // 각 상태 그룹에 컴포넌트 그룹 초기화
  convertedData.statusGroups.forEach(statusGroup => {
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
    componentIssueGroups.forEach(group => {
      // issueStatus를 소문자 및 camelCase로 변환 (TODO -> todo, IN_PROGRESS -> inProgress)
      const statusKey = group.issueStatus === 'TODO' 
        ? 'todo' 
        : group.issueStatus === 'IN_PROGRESS' 
          ? 'inProgress' 
          : 'done';
      
      // 해당 상태 그룹 찾기
      const statusGroup = convertedData.statusGroups.find(sg => sg.status === statusKey);
      if (!statusGroup) return;

      // 각 이슈를 적절한 컴포넌트 그룹에 할당
      group.issues.forEach(issue => {
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
            const foundEntry = Array.from(allComponentsMap.entries())
              .find(([_, name]) => name === issue.component);
              
            if (foundEntry) {
              componentId = foundEntry[0];
              componentName = foundEntry[1];
            }
          }
        }
        
        // 유효한 컴포넌트 ID인 경우만 처리
        if (componentId) {
          // 컴포넌트 그룹 찾기
          let componentGroup = statusGroup.componentGroups.find(cg => cg.id === componentId);
          
          // 컴포넌트 그룹을 찾은 경우에만 이슈 추가
          if (componentGroup) {
            // 이슈 객체 상태 표준화 (API 응답에서 프론트엔드 모델로 변환)
            const formattedIssue = {
              id: issue.id.toString(),
              key: issue.key,
              title: issue.title || issue.name || '',
              epic: issue.epic ? (typeof issue.epic === 'string' ? issue.epic : issue.epic.name || '') : '',
              component: typeof issue.component === 'string' ? issue.component : (issue.component ? issue.component.name || '' : ''),
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
              // position 정보 추가 - API에 있거나 샘플 데이터에 중요함
              position: issue.position || issue.rank || issue.order || null,
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
          }
        }
      });
    });
  }

  return convertedData;
};

/**
 * 빈 스프린트 데이터를 생성
 */
export const createEmptySprintData = (): SprintData => {
  return {
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
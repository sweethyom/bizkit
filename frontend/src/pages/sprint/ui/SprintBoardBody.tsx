import { StatusColumn } from './StatusColumn';
import { SprintData, Issue } from '@/pages/sprint/model/types';
import { getComponentIssueCounts } from '../lib/helpers';
import { useState, useEffect } from 'react';

interface SprintBoardBodyProps {
  sprintData: SprintData;
  onIssueClick: (issue: Issue) => void;
  expandedComponents?: Set<string>;
  onToggleExpand?: (componentName: string) => void;
  filterActive?: boolean;
}

export const SprintBoardBody: React.FC<SprintBoardBodyProps> = ({
  sprintData,
  onIssueClick,
  expandedComponents: propExpandedComponents,
  onToggleExpand: propOnToggleExpand,
  filterActive = false
}) => {
  // 내부 상태 관리 (props가 제공되지 않은 경우)
  const [internalExpandedComponents, setInternalExpandedComponents] = useState<Set<string>>(new Set());

  // 펼쳐진 컴포넌트 관리를 위한 상태 또는 prop 사용
  const expandedComponents = propExpandedComponents || internalExpandedComponents;
  
  // 컴포넌트 펼치기/접기 함수
  const handleToggleExpand = (componentName: string) => {
    if (propOnToggleExpand) {
      propOnToggleExpand(componentName);
    } else {
      setInternalExpandedComponents((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(componentName)) {
          newSet.delete(componentName);
        } else {
          newSet.add(componentName);
        }
        return newSet;
      });
    }
  };

  // 필터가 해제될 때 컴포넌트 그룹 초기화
  useEffect(() => {
    if (!filterActive && !propExpandedComponents) {
      // 필터가 없을 때 초기 상태로 돌리기
      const initialExpandedComponents = new Set<string>();

      sprintData.statusGroups.forEach((statusGroup) => {
        statusGroup.componentGroups.forEach((componentGroup) => {
          if (componentGroup.isExpanded) {
            initialExpandedComponents.add(componentGroup.name);
          }
        });
      });

      setInternalExpandedComponents(initialExpandedComponents);
    }
  }, [filterActive, propExpandedComponents, sprintData]);

  // 컴포넌트별 이슈 총 개수
  const componentIssueCounts = getComponentIssueCounts(sprintData);

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      {sprintData.statusGroups.map((statusGroup) => (
        <StatusColumn
          key={statusGroup.id}
          statusGroup={statusGroup}
          expandedComponents={expandedComponents}
          onToggleExpand={handleToggleExpand}
          onIssueClick={onIssueClick}
          filterActive={filterActive}
          componentIssueCounts={componentIssueCounts}
        />
      ))}
    </div>
  );
};

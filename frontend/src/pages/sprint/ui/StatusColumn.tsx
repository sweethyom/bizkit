import { Droppable } from '@hello-pangea/dnd';
import { StatusGroup, Issue } from '@/pages/sprint/model/types';
import { ComponentGroup } from '@/pages/sprint/ui/ComponentGroup';

interface StatusColumnProps {
  statusGroup: StatusGroup;
  onToggleExpand: (componentName: string) => void;
  expandedComponents: Set<string>;
  onIssueClick?: (issue: Issue) => void;
  filterActive?: boolean;
  componentIssueCounts: {[key: string]: number};
}

const statusColors = {
  todo: 'bg-blue-50 border-blue-200',
  inProgress: 'bg-amber-50 border-amber-200',
  done: 'bg-emerald-50 border-emerald-200',
};

const statusHeaderColors = {
  todo: 'text-blue-700 bg-blue-100',
  inProgress: 'text-amber-700 bg-amber-100',
  done: 'text-emerald-700 bg-emerald-100',
};

export const StatusColumn: React.FC<StatusColumnProps> = ({
  statusGroup,
  onToggleExpand,
  expandedComponents,
  onIssueClick,
  filterActive = false,
  componentIssueCounts,
}) => {
  // 해당 상태에 있는 모든 이슈 개수 계산
  const totalIssues = statusGroup.componentGroups.reduce(
    (total, componentGroup) => total + componentGroup.issues.length,
    0,
  );

  return (
    <div
      className={`flex flex-col rounded-lg border shadow-sm overflow-hidden ${statusColors[statusGroup.status]}`}
    >
      {/* 상태 헤더 */}
      <div className={`p-4 border-b ${statusHeaderColors[statusGroup.status]}`}>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>{statusGroup.title}</h2>
          <span className='inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-white bg-opacity-70 text-sm font-medium'>
            {totalIssues}
          </span>
        </div>
      </div>

      {/* 컴포넌트 그룹 영역 */}
      <Droppable
        droppableId={statusGroup.id}
        type='COMPONENT_GROUP'
        isDropDisabled={true} // 컴포넌트 그룹 자체는 드래그 앤 드롭하지 않음
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='flex-1 p-2 min-h-[400px] max-h-[calc(100vh-200px)] overflow-y-auto'
          >
            {statusGroup.componentGroups.some(group => group.issues.length > 0) ? (
              // 이슈가 있는 경우 컴포넌트 그룹 표시
              <>
                {statusGroup.componentGroups.map((componentGroup) => {
                  // 필터링 경우에는 비어있는 컴포넌트 그룹은 표시하지 않거나 접힌 상태로 표시
                  // 필터가 없는 경우에는 모든 컴포넌트 그룹 표시
                  const noIssuesInComponent = componentGroup.issues.length === 0;
                  
                  // 필터가 활성화되었고 해당 컴포넌트에 이슈가 없는 경우 표시하지 않음
                  if (filterActive && noIssuesInComponent) {
                    return null;
                  }
                  
                  return (
                      <ComponentGroup
                        key={componentGroup.id}
                        componentGroup={{
                          ...componentGroup,
                          isExpanded: expandedComponents.has(componentGroup.name)
                        }}
                        statusId={statusGroup.id}
                        onToggleExpand={() => onToggleExpand(componentGroup.name)}
                        onIssueClick={onIssueClick}
                        maxIssueCount={componentIssueCounts[componentGroup.name] || 0}
                      />
                  );
                })}
              </>
            ) : (
              // 필터링 된 결과가 없는 경우 메시지 표시
              <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p className="text-center">필터링된 결과가 없습니다.</p>
                <p className="text-sm mt-1">필터를 변경하거나 초기화해 보세요.</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

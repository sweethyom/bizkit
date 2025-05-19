import { Issue, StatusGroup } from '@/pages/sprint/model/types';
import { ComponentGroup } from '@/pages/sprint/ui/ComponentGroup';
import { Droppable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

interface StatusColumnProps {
  statusGroup: StatusGroup;
  onToggleExpand: (componentName: string) => void;
  expandedComponents: Set<string>;
  onIssueClick?: (issue: Issue) => void;
  filterActive?: boolean;
  componentIssueCounts: { [key: string]: number };
}

const statusColors = {
  todo: 'border-l-primary',
  inProgress: 'border-l-amber-500',
  done: 'border-l-emerald-500',
};

const statusIcons = {
  todo: <div className='size-4 rounded-full bg-primary'></div>,
  inProgress: <div className='size-4 rounded-full bg-amber-500'></div>,
  done: <div className='size-4 rounded-full bg-emerald-500'></div>,
};

const statusHeaderColors = {
  todo: 'text-primary',
  inProgress: 'text-amber-600',
  done: 'text-emerald-600',
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
  
  const [isExpanded, setIsExpanded] = useState(true);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-md border border-l-6 shadow-sm ${statusColors[statusGroup.status]} bg-white`}
    >
      {/* 상태 헤더 */}
      <div 
        onClick={toggleExpanded}
        className={`${isExpanded ? 'border-b border-gray-200' : ''} flex cursor-pointer items-center justify-between p-4 ${statusHeaderColors[statusGroup.status]}`}
      >
        <div className='flex items-center gap-2'>
          <ChevronRight
            className={clsx(
              'transition-transform',
              statusHeaderColors[statusGroup.status],
              isExpanded ? 'rotate-90' : 'rotate-0',
            )}
          />
          {statusIcons[statusGroup.status]}
          <h2 className='text-label-xl font-semibold'>{statusGroup.title}</h2>
        </div>
        <span className='bg-gray-100 text-gray-700 inline-flex items-center justify-center rounded-full px-2.5 py-1 text-sm font-medium'>
          {totalIssues}
        </span>
      </div>

      {/* 컴포넌트 그룹 영역 - 애니메이션 적용 */}
      <div
        style={{
          maxHeight: isExpanded ? '100vh' : '0',
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
        }}
      >
        <Droppable
          droppableId={statusGroup.id}
          type='COMPONENT_GROUP'
          isDropDisabled={true} // 컴포넌트 그룹 자체는 드래그 앤 드롭하지 않음
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='max-h-[calc(100vh-200px)] overflow-y-auto p-4 bg-white'
            >
              {/* 모든 컴포넌트 그룹 항상 표시 */}
              {statusGroup.componentGroups.map((componentGroup) => {
                // 필터링 경우에는 비어있는 컴포넌트 그룹은 표시하지 않음
                const noIssuesInComponent = componentGroup.issues.length === 0;

                // 필터가 활성화되었고 해당 컴포넌트에 이슈가 없는 경우에만 표시하지 않음
                if (filterActive && noIssuesInComponent) {
                  return null;
                }

                return (
                  <ComponentGroup
                    key={componentGroup.id}
                    componentGroup={{
                      ...componentGroup,
                      isExpanded: expandedComponents.has(componentGroup.name),
                    }}
                    statusId={statusGroup.id}
                    onToggleExpand={() => onToggleExpand(componentGroup.name)}
                    onIssueClick={onIssueClick}
                    maxIssueCount={componentIssueCounts[componentGroup.name] || 0}
                  />
                );
              })}

              {/* 전체 필터링 결과가 없는 경우에만 메시지 표시 */}
              {filterActive &&
                statusGroup.componentGroups.every(
                  (group) => group.issues.length === 0 || (filterActive && group.issues.length === 0),
                ) && (
                  <div className='flex h-32 flex-col items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
                    <svg
                      className='mb-3 h-12 w-12 text-gray-300'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                      ></path>
                    </svg>
                    <p className='text-center'>필터링된 결과가 없습니다.</p>
                    <p className='mt-1 text-sm'>필터를 변경하거나 초기화해 보세요.</p>
                  </div>
                )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
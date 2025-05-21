import { Issue, StatusGroup } from '@/pages/sprint/model/types';
import { ComponentGroup } from '@/pages/sprint/ui/ComponentGroup';
import { Droppable } from '@hello-pangea/dnd';
import { CheckCircle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
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
  todo: 'bg-gray-600',
  inProgress: 'bg-orange-500',
  done: 'bg-blue-600',
};

const statusIcons = {
  todo: <CheckCircle className="h-4 w-4" />,
  inProgress: <Clock className="h-4 w-4" />,
  done: <CheckCircle2 className="h-4 w-4" />,
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
  const contentRef = useRef<HTMLDivElement>(null);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-200 hover:shadow-lg"
    >
      {/* Status Header */}
      <div 
        onClick={toggleExpanded}
        className={`${statusColors[statusGroup.status]} flex cursor-pointer items-center justify-between p-4 text-white hover:brightness-105 transition-all duration-200`}
      >
        <div className='flex items-center gap-3'>
          <div
            className={clsx(
              "transition-transform duration-200",
              isExpanded ? "rotate-90" : "rotate-0"
            )}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </div>
          
          <div className='flex items-center justify-center size-6 rounded-full bg-white/20 backdrop-blur-sm'>
            {statusIcons[statusGroup.status]}
          </div>
          
          <h2 className='text-lg font-bold'>{statusGroup.title}</h2>
        </div>
        
        <span 
          className='bg-white/20 text-white inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm hover:bg-white/30 transition-all duration-200'
        >
          {totalIssues}
        </span>
      </div>

      {/* Component Groups Area with Animation */}
      <div
        style={{
          maxHeight: isExpanded ? '100vh' : '0',
          opacity: isExpanded ? 1 : 0.8,
          transition: "max-height 0.3s ease-in-out, opacity 0.2s ease"
        }}
        className="overflow-hidden"
      >
        <div ref={contentRef}>
          <Droppable
            droppableId={statusGroup.id}
            type='COMPONENT_GROUP'
            isDropDisabled={true} // Component groups themselves are not draggable
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={clsx(
                  'max-h-[calc(100vh-200px)] overflow-y-auto p-4 bg-white transition-colors duration-200',
                  snapshot.isDraggingOver && 'bg-gray-100/50'
                )}
              >
                {statusGroup.componentGroups.map((componentGroup, idx) => {
                  // Don't show empty component groups when filtering
                  const noIssuesInComponent = componentGroup.issues.length === 0;

                  // Only hide if filter is active and component has no issues
                  if (filterActive && noIssuesInComponent) {
                    return null;
                  }

                  return (
                    <div
                      key={componentGroup.id}
                      className="transition-all duration-200"
                    >
                      <ComponentGroup
                        componentGroup={{
                          ...componentGroup,
                          isExpanded: expandedComponents.has(componentGroup.name),
                        }}
                        statusId={statusGroup.id}
                        onToggleExpand={() => onToggleExpand(componentGroup.name)}
                        onIssueClick={onIssueClick}
                        maxIssueCount={componentIssueCounts[componentGroup.name] || 0}
                      />
                    </div>
                  );
                })}

                {/* No results message when filtering */}
                {filterActive &&
                  statusGroup.componentGroups.every(
                    (group) => group.issues.length === 0 || (filterActive && group.issues.length === 0),
                  ) && (
                    <div className='flex h-24 flex-col items-center justify-center py-4 text-gray-500 bg-gray-50/80 rounded-lg border border-dashed border-gray-300 mt-2 transition-all duration-300'>
                      <svg
                        className='mb-2 h-10 w-10 text-gray-300'
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
                      <p className='text-sm'>필터링된 결과가 없습니다</p>
                    </div>
                  )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
};

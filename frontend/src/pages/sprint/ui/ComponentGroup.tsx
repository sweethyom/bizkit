import { Droppable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { clsx } from 'clsx';
import { ComponentGroup as ComponentGroupType, Issue } from '@/pages/sprint/model/types';
import { IssueCard } from '@/pages/sprint/ui/IssueCard';

interface ComponentGroupProps {
  componentGroup: ComponentGroupType;
  statusId: string;
  onToggleExpand: (componentId: string) => void;
  onIssueClick?: (issue: Issue) => void;
  maxIssueCount: number;
}

export const ComponentGroup: React.FC<ComponentGroupProps> = ({
  componentGroup,
  statusId,
  onToggleExpand,
  onIssueClick,
  maxIssueCount,
}) => {
  const droppableId = `${statusId}-${componentGroup.id}`;
  const issueCount = componentGroup.issues.length;
  
  // 필터링에 의해 이슈가 없는 경우, 이 컴포넌트 그룹을 더 작게 표시
  const hasNoIssues = issueCount === 0;

  return (
    <div className='mb-3'>
      <div
        className={`flex items-center justify-between px-3 py-2 bg-white rounded-t-md cursor-pointer hover:bg-gray-50 shadow-sm border transition-all ${
          componentGroup.isExpanded ? 'border-gray-300' : 'border-gray-200'
        } ${hasNoIssues ? 'opacity-60' : ''}`}
        onClick={() => onToggleExpand(componentGroup.id)}
      >
        <div className='flex items-center'>
          {componentGroup.isExpanded ? (
            <ChevronDown className='h-4 w-4 text-gray-500 mr-2' />
          ) : (
            <ChevronRight className='h-4 w-4 text-gray-500 mr-2' />
          )}
          <Folder className='h-4 w-4 text-blue-500 mr-2' />
          <span className='font-medium text-gray-700'>{componentGroup.name}</span>
        </div>

        <div className='flex items-center'>
          <span className='inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-700'>
            {issueCount}
          </span>
        </div>
      </div>

      {componentGroup.isExpanded && (
        <Droppable droppableId={droppableId} type='ISSUE'>
          {(provided, snapshot) => {
            // 이슈의 연속적인 개수에 따르는 최소 하이트 계산
            // 필터링으로 이슈가 없는 경우에도 동일한 하이트 유지
            const emptyIssues = Math.max(0, maxIssueCount - componentGroup.issues.length);
            
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={clsx(
                  'bg-gray-100 px-1 pt-1 pb-0.5 min-h-[50px] rounded-b-md transition-colors',
                  snapshot.isDraggingOver ? 'bg-blue-50' : ''
                )}
              >
                {componentGroup.issues.length > 0 ? (
                  <>
                    {componentGroup.issues.map((issue, index) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        index={index}
                        onIssueClick={onIssueClick}
                      />
                    ))}
                    
                    {/* 필터링으로 일부 이슈가 표시되지 않을 경우, 동일한 하이트를 유지하기 위한 공백 요소 */}
                    {emptyIssues > 0 && Array.from({ length: emptyIssues }).map((_, idx) => (
                      <div key={`empty-${idx}`} className='h-[62px] mb-2 opacity-0'></div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className='text-center py-4 text-sm text-gray-500 italic'>이슈가 없습니다</div>
                    
                    {/* 이슈가 없는 경우에도 동일한 하이트 유지 */}
                    {maxIssueCount > 0 && Array.from({ length: maxIssueCount }).map((_, idx) => (
                      <div key={`empty-space-${idx}`} className='h-[62px] mb-2 opacity-0'></div>
                    ))}
                  </>
                )}
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
      )}
    </div>
  );
};

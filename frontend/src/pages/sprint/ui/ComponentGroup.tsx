import { ComponentGroup as ComponentGroupType, Issue } from '@/pages/sprint/model/types';
import { IssueCard } from '@/pages/sprint/ui/IssueCard';
import { Droppable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import { ChevronDown, ChevronRight, Component } from 'lucide-react';

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
        className={`flex cursor-pointer items-center justify-between rounded-t-md border p-3 ${
          componentGroup.isExpanded 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-200 bg-white'
        } ${hasNoIssues ? 'opacity-80' : ''} shadow-sm transition-all hover:bg-gray-50`}
        onClick={() => onToggleExpand(componentGroup.id)}
      >
        <div className='flex items-center gap-2'>
          {componentGroup.isExpanded ? (
            <ChevronDown className='h-5 w-5 text-primary' />
          ) : (
            <ChevronRight className='h-5 w-5 text-gray-500' />
          )}
          <Component className='h-5 w-5 text-point' />
          <span className='font-medium text-gray-700'>{componentGroup.name}</span>
        </div>

        <div className='flex items-center'>
          <span className='inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-700'>
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
                  'min-h-[50px] rounded-b-md p-3 transition-colors border border-t-0 border-gray-200',
                  snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-white',
                )}
              >
                {componentGroup.issues.length > 0 ? (
                  <>
                    <div className="grid gap-3">
                      {componentGroup.issues.map((issue, index) => (
                        <IssueCard
                          key={issue.id}
                          issue={issue}
                          index={index}
                          onIssueClick={onIssueClick}
                        />
                      ))}
                    </div>

                    {/* 필터링으로 일부 이슈가 표시되지 않을 경우, 동일한 하이트를 유지하기 위한 공백 요소 */}
                    {emptyIssues > 0 &&
                      Array.from({ length: emptyIssues }).map((_, idx) => (
                        <div key={`empty-${idx}`} className='mb-2 h-[62px] opacity-0'></div>
                      ))}
                  </>
                ) : (
                  <>
                    <div className='py-6 text-center text-sm text-gray-500 italic bg-gray-50 rounded-md border border-dashed border-gray-300'>
                      이슈가 없습니다
                    </div>

                    {/* 이슈가 없는 경우에도 동일한 하이트 유지 */}
                    {maxIssueCount > 0 &&
                      Array.from({ length: maxIssueCount }).map((_, idx) => (
                        <div key={`empty-space-${idx}`} className='mb-2 h-[62px] opacity-0'></div>
                      ))}
                  </>
                )}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      )}
    </div>
  );
};
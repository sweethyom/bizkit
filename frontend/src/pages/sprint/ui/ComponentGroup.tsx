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
}

export const ComponentGroup: React.FC<ComponentGroupProps> = ({
  componentGroup,
  statusId,
  onToggleExpand,
  onIssueClick,
}) => {
  const droppableId = `${statusId}-${componentGroup.id}`;
  const issueCount = componentGroup.issues.length;

  return (
    <div className='mb-3'>
      <div
        className={`flex items-center justify-between px-3 py-2 bg-white rounded-md cursor-pointer hover:bg-gray-50 shadow-sm border transition-all ${
          componentGroup.isExpanded ? 'border-gray-300' : 'border-gray-200'
        }`}
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
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={clsx(
                'mt-1 px-1 pt-1 pb-0.5 min-h-[50px] rounded-md transition-colors',
                snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-transparent',
              )}
            >
              {componentGroup.issues.length > 0 ? (
                componentGroup.issues.map((issue, index) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    index={index}
                    onIssueClick={onIssueClick}
                  />
                ))
              ) : (
                <div className='text-center py-4 text-sm text-gray-500 italic'>이슈가 없습니다</div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

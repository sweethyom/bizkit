import { Draggable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import { Issue } from '@/pages/sprint/model/types';
import { ArrowUp, ArrowRight, ArrowDown, Clock } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  index: number;
  onIssueClick?: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, index, onIssueClick }) => {
  const priorityIcons = {
    low: <ArrowDown className='w-3 h-3 text-blue-600' />,
    medium: <ArrowRight className='w-3 h-3 text-amber-600' />,
    high: <ArrowUp className='w-3 h-3 text-red-600' />,
  };

  const priorityColors = {
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  const priorityLabels = {
    low: '낮음',
    medium: '중간',
    high: '높음',
  };

  const handleClick = () => {
    if (onIssueClick) {
      onIssueClick(issue);
    }
  };

  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={clsx(
            'bg-white rounded-lg mb-2 p-3 border border-gray-200 shadow-sm cursor-pointer hover:border-gray-300 hover:shadow transition-all',
            snapshot.isDragging && 'shadow-md border-blue-300 bg-blue-50',
          )}
        >
          <div className='flex items-center justify-between mb-2'>
            <div className='text-gray-500 text-xs font-medium bg-gray-100 px-2 py-0.5 rounded'>
              {issue.key}
            </div>
            <div
              className={clsx(
                'flex items-center text-xs px-2 py-0.5 rounded border',
                priorityColors[issue.priority],
              )}
            >
              {priorityIcons[issue.priority]}
              <span className='ml-1'>{priorityLabels[issue.priority]}</span>
            </div>
          </div>

          <h3 className='font-medium text-gray-800 mb-2 line-clamp-2'>{issue.title}</h3>

          <div className='flex items-center justify-between text-xs text-gray-500 mt-2'>
            <div className='flex items-center'>
              <div className='w-5 h-5 bg-gray-300 rounded-full mr-1 flex items-center justify-center text-white font-bold text-xs'>
                {issue.assignee.charAt(0)}
              </div>
              <span>{issue.assignee}</span>
            </div>

            <div className='flex items-center'>
              <Clock className='w-3 h-3 mr-1' />
              <span>{issue.storyPoints} 포인트</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

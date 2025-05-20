import { Issue } from '@/pages/sprint/model/types';
import { Draggable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import { Clock, Hash, Star, Tag } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  index: number;
  onIssueClick?: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, index, onIssueClick }) => {
  const handleClick = () => {
    if (onIssueClick) {
      onIssueClick(issue);
    }
  };

  // 담당자 이니셜 계산
  const initials =
    typeof issue.assignee === 'string'
      ? issue.assignee.charAt(0).toUpperCase()
      : issue.assignee?.nickname?.charAt(0)?.toUpperCase() || '';

  // 이슈의 우선순위에 따라 표시될 한글 레이블을 결정합니다.
  const priorityLabel =
    {
      low: '낮음',
      high: '높음',
    }[issue.priority] || '';

  const statusColors = {
    todo: 'bg-primary/10 text-primary',
    inProgress: 'bg-amber-500/10 text-amber-600',
    done: 'bg-emerald-500/10 text-emerald-600',
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-blue-100 text-blue-700',
  };

  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={handleClick}
            className={clsx(
              'relative cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:bg-gray-50',
              snapshot.isDragging ? 'ring-primary shadow-md ring-2' : 'border-gray-200',
            )}
          >
            {/* 이슈 상단 섹션 */}
            <div className='mb-2 flex items-start justify-between'>
              <div className='mb-1 flex items-center gap-2'>
                <div
                  className={`rounded px-2 py-1 text-xs font-medium ${statusColors[issue.status]}`}
                >
                  {issue.status === 'todo'
                    ? '할 일'
                    : issue.status === 'inProgress'
                      ? '진행 중'
                      : '완료'}
                </div>

                {issue.priority && (
                  <div
                    className={`rounded px-2 py-1 text-xs font-medium ${priorityColors[issue.priority]}`}
                  >
                    {priorityLabel}
                  </div>
                )}
              </div>

              <div className='flex items-center text-xs font-medium text-gray-500'>
                <Hash size={14} className='mr-1' />
                {issue.key}
              </div>
            </div>

            {/* 이슈 제목 */}
            <div className='mb-2'>
              <h3 className='text-sm font-medium text-gray-800'>{issue.title}</h3>
            </div>

            {/* 태그들 */}
            <div className='mb-3 flex flex-wrap gap-1'>
              {issue.epic && (
                <div className='inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700'>
                  <Star size={12} className='mr-1' />
                  {issue.epic}
                </div>
              )}

              {issue.component && (
                <div className='inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'>
                  <Tag size={12} className='mr-1' />
                  {issue.component}
                </div>
              )}

              {issue.storyPoints > 0 && (
                <div className='inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'>
                  <Clock size={12} className='mr-1' />
                  {issue.storyPoints}점
                </div>
              )}
            </div>

            {/* 담당자 */}
            <div className='mt-1 flex items-center justify-end'>
              {issue.assignee ? (
                <div className='flex items-center gap-1 text-xs text-gray-600'>
                  {typeof issue.assignee !== 'string' && issue.assignee?.profileImageUrl ? (
                    <img
                      src={issue.assignee.profileImageUrl}
                      alt={issue.assignee.nickname || '담당자'}
                      className='h-6 w-6 rounded-full border border-gray-200 object-cover shadow-sm'
                    />
                  ) : (
                    <div className='bg-primary flex h-6 w-6 items-center justify-center rounded-full font-medium text-white shadow-sm'>
                      {initials}
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex items-center justify-end'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-500 shadow-sm'>
                    ?
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

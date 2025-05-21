import { Issue } from '@/pages/sprint/model/types';
import { Draggable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import { Briefcase, BringToFront, Hash } from 'lucide-react';

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
    todo: 'bg-gray-100 text-gray-700 border border-gray-200',
    inProgress: 'bg-orange-100 text-orange-700',
    done: 'bg-blue-100 text-blue-700',
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border border-red-200',
    medium: 'bg-amber-100 text-amber-700 border border-amber-200',
    low: 'bg-blue-100 text-blue-700 border border-blue-200',
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
              'relative cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:bg-gray-50/70',
              snapshot.isDragging ? 'ring-gray-500 shadow-lg ring-2 border-gray-300' : 'border-gray-200',
            )}
          >
            {/* 이슈 상단 섹션 */}
            <div className='mb-3 flex items-start justify-between'>
              <div className='mb-1 flex items-center gap-2'>
                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[issue.status]}`}
                >
                  {issue.status === 'todo'
                    ? '할 일'
                    : issue.status === 'inProgress'
                      ? '진행 중'
                      : '완료'}
                </div>

                {issue.priority && (
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColors[issue.priority]}`}
                  >
                    {priorityLabel}
                  </div>
                )}
              </div>

              <div className='flex items-center text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2 py-1'>
                <Hash size={14} className='mr-1' />
                {issue.key}
              </div>
            </div>

            {/* 이슈 제목 */}
            <div className='mb-3'>
              <h3 className='text-base font-semibold text-gray-800'>{issue.title}</h3>
            </div>

            {/* 태그들 */}
            <div className='mb-3 flex flex-wrap gap-2'>
              {issue.epic && (
                <div className='inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-200'>
                  <BringToFront size={14} className='mr-1.5' />
                  {issue.epic}
                </div>
              )}

              {issue.storyPoints > 0 && (
                <div className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200'>
                  <Briefcase size={14} className='mr-1.5' />
                  {issue.storyPoints}점
                </div>
              )}
            </div>

            {/* 담당자 */}
            <div className='mt-2 flex items-center justify-end'>
              {issue.assignee ? (
                <div className='flex items-center gap-2 text-xs text-gray-600'>
                  <span className='text-gray-500 mr-1'>담당자:</span>
                  {typeof issue.assignee !== 'string' && issue.assignee?.profileImageUrl ? (
                    <img
                      src={issue.assignee.profileImageUrl ?? '/images/default-profile.png'}
                      alt={issue.assignee.nickname || '담당자'}
                      className='h-8 w-8 rounded-full border border-gray-200 object-cover shadow-sm'
                    />
                  ) : (
                    <div className='bg-indigo-600 flex h-8 w-8 items-center justify-center rounded-full font-medium text-white shadow-sm'>
                      {initials}
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex items-center justify-end text-gray-500'>
                  <span className='mr-2 text-xs'>담당자 없음</span>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 shadow-sm'>
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

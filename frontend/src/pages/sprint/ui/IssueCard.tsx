import { Draggable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import { Issue } from '@/pages/sprint/model/types';

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

  // 담당자 이니셜
  const initials = issue.assignee?.charAt(0)?.toUpperCase() || '';
  
  // 우선순위 레이블
  const priorityLabel = {
    low: '낮음',
    medium: '중간',
    high: '높음'
  }[issue.priority] || '';

  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={clsx(
            'bg-gray-200 mb-2 cursor-pointer transition-all relative border border-gray-300',
            snapshot.isDragging && 'bg-gray-300',
          )}
        >
          {/* 와이어프레임 스타일이지만 실제 데이터 표시 */}
          <div>
            {/* 헤더 영역 - 실제 키 값 */}
            <div className='p-1 border-b border-gray-300 bg-gray-300'>
              <div className='text-xs font-medium'>{issue.key}</div>
            </div>
            
            {/* 내용 영역 - 실제 데이터 */}
            <div className='p-1'>
              <div className='text-xs truncate'>{issue.title}</div>
              <div className='text-xs truncate'>{issue.epic}</div>
              <div className='text-xs truncate'>{issue.component}</div>
              <div className='text-xs truncate'>{issue.assignee}</div>
            </div>

            {/* 하단 정보 영역 - 실제 데이터 */}
            <div className='border-t border-gray-300 p-1 bg-gray-300'>
              <div className='text-xs flex items-center justify-between'>
                <span>{issue.storyPoints}점</span>
                <span>{priorityLabel}</span>
                <span>{issue.assignee.split(' ')[0]}</span>
              </div>
            </div>
          </div>
          
          {/* 담당자 아바타 */}
          {initials && (
            <div className='absolute top-1 right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xs'>
              {initials}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

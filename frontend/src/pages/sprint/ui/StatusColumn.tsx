import { Droppable } from '@hello-pangea/dnd';
import { StatusGroup, Issue } from '@/pages/sprint/model/types';
import { ComponentGroup } from '@/pages/sprint/ui/ComponentGroup';

interface StatusColumnProps {
  statusGroup: StatusGroup;
  onToggleExpand: (statusGroupId: string, componentId: string) => void;
  onIssueClick?: (issue: Issue) => void;
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
  onIssueClick,
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
            {statusGroup.componentGroups.map((componentGroup) => (
              <ComponentGroup
                key={componentGroup.id}
                componentGroup={componentGroup}
                statusId={statusGroup.id}
                onToggleExpand={() => onToggleExpand(statusGroup.id, componentGroup.id)}
                onIssueClick={onIssueClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

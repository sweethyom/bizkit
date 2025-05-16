import { useIssue } from '@/pages/backlog/lib/useIssue';
import { SectionCard } from '@/pages/backlog/ui/card/SectionCard';

import { IssueCard } from '@/entities/issue';
import { Sprint } from '@/entities/sprint';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { SprintCardHeader } from './SprintCardHeader';

interface SprintCardProps {
  sprint: Sprint;
}

export const SprintCard = ({ sprint }: SprintCardProps) => {
  const { issues, getIssues } = useIssue({ type: 'sprint', typeId: sprint.id });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      getIssues();
    }
  }, [sprint.id, getIssues, expanded]);

  return (
    <SectionCard
      cardType='sprint'
      cardId={sprint.id}
      expanded={expanded}
      toggleExpanded={() => setExpanded((prev) => !prev)}
      header={<SprintCardHeader sprint={sprint} remainIssueCount={issues?.length} />}
    >
      <Droppable droppableId={`sprint-${sprint.id}`}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {!snapshot.isDraggingOver && issues !== undefined && issues.length === 0 && (
              <div className='text-gray-4 flex flex-col items-center justify-center gap-1 py-8'>
                <span className='text-label-md font-medium'>스프린트가 비어있습니다</span>
                <span className='text-label-sm'>에픽에서 이슈를 추가해 시작해보세요</span>
              </div>
            )}

            {issues &&
              issues.map((issue, index) => (
                <Draggable
                  key={`sprint-${sprint.id}-issue-${issue.id}-${index}`}
                  draggableId={`sprint-${sprint.id}-issue-${issue.id}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <IssueCard issue={issue} />
                    </div>
                  )}
                </Draggable>
              ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </SectionCard>
  );
};

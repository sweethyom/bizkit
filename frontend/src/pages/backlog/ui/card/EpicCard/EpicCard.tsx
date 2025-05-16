import { useIssue } from '@/pages/backlog/lib/useIssue';
import { SectionCard } from '@/pages/backlog/ui/card/SectionCard';

import { Epic } from '@/entities/epic';
import { IssueCard, IssueForm } from '@/entities/issue';

import { Button } from '@/shared/ui';

import { EpicCardHeader } from './EpicCardHeader';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EpicCardProps {
  epic: Epic;
}

export const EpicCard = ({ epic }: EpicCardProps) => {
  const { issues, getIssues } = useIssue({ type: 'epic', typeId: epic.id });
  const [expanded, setExpanded] = useState(false);

  const [showIssueForm, setShowIssueForm] = useState(false);

  useEffect(() => {
    if (expanded) {
      getIssues();
    }
  }, [epic.id, getIssues, expanded]);

  return (
    <SectionCard
      cardType='epic'
      cardId={epic.id}
      expanded={expanded}
      toggleExpanded={() => setExpanded((prev) => !prev)}
      header={<EpicCardHeader epic={epic} />}
    >
      <>
        {showIssueForm ? (
          <IssueForm epicId={epic.id} onCancel={() => setShowIssueForm(false)} />
        ) : (
          <Button variant='dotted' onClick={() => setShowIssueForm(true)}>
            <Plus size={20} />
            이슈 추가
          </Button>
        )}

        <Droppable droppableId={`epic-${epic.id}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {issues &&
                issues.map((issue, index) => (
                  <Draggable
                    key={issue.id}
                    draggableId={`epic-${epic.id}-issue-${issue.id}`}
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
      </>
    </SectionCard>
  );
};

import { SectionCard } from '@/pages/backlog/ui/card/SectionCard';

import { deleteEpic, Epic } from '@/entities/epic';
import { IssueCard, IssueForm, useIssue } from '@/entities/issue';

import { api, ApiResponse } from '@/shared/api';
import { Button } from '@/shared/ui';

import { EpicCardHeader } from './EpicCardHeader';

import { useIssueModalStore } from '@/widgets/issue-detail-modal';
import { Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EpicCardProps {
  epic: Epic;
  onDeleteIssue: (epicId: number) => void;
}

export const EpicCard = ({ epic, onDeleteIssue }: EpicCardProps) => {
  const { issues, getIssues, removeIssue } = useIssue({ type: 'epic', typeId: epic.id });
  const { openModal } = useIssueModalStore();

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
      moreActions={[
        {
          children: '에픽 수정',
          onClick: async () => {
            const response = await api.patch<ApiResponse<void>>(`/epics/${epic.id}/name`, {
              name: 'epic 2',
            });
            console.log(response.data);
          },
        },
        {
          children: '에픽 삭제',
          onClick: async () => {
            const response = await deleteEpic(epic.id);
            console.log(response);
          },
        },
      ]}
    >
      <>
        {showIssueForm ? (
          <IssueForm epicId={epic.id} handleVisibility={() => setShowIssueForm(false)} />
        ) : (
          <Button variant='dotted' onClick={() => setShowIssueForm(true)}>
            <Plus size={20} />
            이슈 추가
          </Button>
        )}

        <div className='flex flex-col gap-2'>
          {issues &&
            issues.map((issue, index) => {
              issue.epic = epic;
              issue.assignee = issue.user;

              return (
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
                      className=''
                      style={{ ...provided.draggableProps.style }}
                    >
                      <IssueCard
                        issue={issue}
                        onClick={() => {
                          openModal(issue);
                        }}
                        onDelete={() => {
                          removeIssue(issue.id);
                          onDeleteIssue(epic.id);
                        }}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
        </div>
      </>
    </SectionCard>
  );
};

import { SectionCard } from '@/pages/backlog/ui/card/SectionCard';

import { IssueCard, useIssue } from '@/entities/issue';
import { Sprint, sprintApi, SprintStatus, useSprintForm } from '@/entities/sprint';

import { SprintCardHeader } from './SprintCardHeader';

import { useIssueModalStore } from '@/widgets/issue-detail-modal';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

interface SprintCardProps {
  sprint: Sprint;
  onStartSprint: () => void;
  onCompleteSprint: () => void;
  onDeleteSprint: (sprintId: number) => void;
  dragSource?: string | null;
}

export const SprintCard = ({
  sprint,
  onStartSprint,
  onCompleteSprint,
  onDeleteSprint,
  dragSource,
}: SprintCardProps) => {
  const { projectId } = useParams();

  const [expanded, setExpanded] = useState(false);

  const {
    name: sprintName,
    isValid,
    handleNameChange,
    onUpdate: onUpdateSprintName,
    initName: initSprintName,
  } = useSprintForm(Number(projectId), sprint.name);

  const [isEditing, setIsEditing] = useState(false);

  const {
    issues,
    getIssues,
    removeIssue,
    isLoading: isLoadingIssues,
  } = useIssue({
    type: 'sprint',
    typeId: sprint.id,
  });
  const { openModal: openIssueModal } = useIssueModalStore();

  useEffect(() => {
    if (sprint.sprintStatus === SprintStatus.ONGOING) {
      setExpanded(true);
    }
  }, [sprint.sprintStatus]);

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
      header={
        <SprintCardHeader
          sprint={sprint}
          remainIssueCount={issues?.length}
          isEditing={isEditing}
          sprintName={sprintName}
          setSprintName={handleNameChange}
          onSave={async (editedName) => {
            if (!isValid) {
              initSprintName();
              setIsEditing(false);
            }

            if (editedName === sprint.name) {
              setIsEditing(false);
              return;
            }

            try {
              onUpdateSprintName(sprint.id);
            } catch (error) {
              console.error(error);
            }

            setIsEditing(false);
          }}
          onCancel={() => {
            initSprintName();
            setIsEditing(false);
          }}
        />
      }
      moreActions={[
        {
          children:
            sprint.sprintStatus === SprintStatus.ONGOING ? '스프린트 종료' : '스프린트 시작',
          onClick: async () => {
            if (sprint.sprintStatus === SprintStatus.ONGOING) {
              onCompleteSprint();
            } else {
              onStartSprint();
            }
          },
        },
        {
          children: '스프린트 수정',
          onClick: () => setIsEditing(true),
        },
        {
          children: '스프린트 삭제',
          onClick: async () => {
            await sprintApi.deleteSprint(sprint.id);
            onDeleteSprint(sprint.id);
          },
        },
      ]}
    >
      <Droppable
        droppableId={`sprint-${sprint.id}`}
        isDropDisabled={!(dragSource && dragSource.startsWith('epic-'))}
      >
        {(provided) => {
          return (
            <div
              className='flex flex-col gap-2'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {isLoadingIssues ||
                issues === undefined ||
                (issues.length === 0 && (
                  <div className='text-gray-4 flex flex-col items-center justify-center gap-1 py-8'>
                    <span className='text-label-md font-medium'>스프린트가 비어있습니다</span>
                    <span className='text-label-sm'>에픽에서 이슈를 추가해 시작해보세요</span>
                  </div>
                ))}

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
                        <IssueCard
                          issue={issue}
                          onClick={() => openIssueModal(issue)}
                          onDelete={() => removeIssue(issue.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </SectionCard>
  );
};

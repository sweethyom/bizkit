import { useIssueModalStore } from '@/widgets/issue-detail-modal';

import { Issue, IssueCard, useIssue } from '@/entities/issue';
import { Sprint, sprintApi, SprintStatus, useSprintForm } from '@/entities/sprint';

import { DropDownSection, IconButton } from '@/shared/ui';

import { SprintCardHeader } from './SprintCardHeader';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

interface SprintCardProps {
  sprint: Sprint;
  startError: { sprintId: number; message: string; invalidIssues: Issue[] } | null;
  dragSource: string | null;
  onStartSprint: () => void;
  onCompleteSprint: () => void;
  onDeleteSprint: (sprintId: number) => void;
}

export const SprintCard = ({
  sprint,
  startError,
  onStartSprint,
  onCompleteSprint,
  onDeleteSprint,
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

  const { issues, getIssues, removeIssue } = useIssue({
    type: 'sprint',
    typeId: sprint.id,
  });
  const { openModal: openIssueModal } = useIssueModalStore();

  useEffect(() => {
    if (startError?.sprintId === sprint.id) {
      setExpanded(true);
    }
  }, [startError, sprint.id]);

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

  const moreActions = [
    {
      children: sprint.sprintStatus === SprintStatus.ONGOING ? '스프린트 종료' : '스프린트 시작',
      onClick: async () => {
        if (sprint.sprintStatus === SprintStatus.ONGOING) {
          onCompleteSprint();
        } else {
          onStartSprint();
        }
      },
      disabled: sprint.sprintStatus === SprintStatus.COMPLETED,
    },
    {
      children: '스프린트 수정',
      onClick: () => setIsEditing(true),
    },
    {
      children: '스프린트 삭제',
      onClick: async () => {
        if (sprint.sprintStatus === SprintStatus.ONGOING) {
          alert('스프린트를 종료한 후 삭제해주세요');
          return;
        }

        if (issues && issues.length > 0) {
          if (confirm('스프린트 내 이슈가 모두 삭제됩니다.')) {
            await sprintApi.deleteSprint(sprint.id);
            onDeleteSprint(sprint.id);
            return;
          }
        }

        await sprintApi.deleteSprint(sprint.id);
        onDeleteSprint(sprint.id);
      },
    },
  ];

  return (
    <Droppable
      droppableId={`sprint-${sprint.id}`}
      isDropDisabled={sprint.sprintStatus === SprintStatus.COMPLETED}
    >
      {(provided, snapshot) => {
        return (
          <div className='border-gray-3 border-l-primary relative flex flex-col overflow-hidden rounded-md border border-l-6 shadow-sm'>
            <div
              className='bg-gray-3/10 absolute top-1/2 left-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2'
              style={{
                visibility: snapshot.isDraggingOver ? 'visible' : 'hidden',
              }}
            />

            <div
              className={clsx(
                'flex cursor-pointer items-center gap-4 bg-white p-4',
                expanded && 'border-gray-2 border-b',
              )}
              onClick={() => setExpanded((prev) => !prev)}
            >
              <ChevronRight
                className={clsx(
                  'text-primary shrink-0 transition-transform',
                  expanded ? 'rotate-90' : 'rotate-0',
                )}
              />

              <SprintCardHeader
                sprint={sprint}
                remainIssueCount={issues?.filter((issue) => issue.issueStatus !== 'DONE').length}
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

              <DropDownSection
                items={moreActions}
                button={(toggleVisibility) => (
                  <IconButton
                    icon='ellipsis'
                    onClick={() => {
                      toggleVisibility();
                    }}
                  />
                )}
              />
            </div>

            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={clsx('absolute inset-0 -z-50 px-4', expanded ? 'py-30' : '-my-2')}
            ></div>

            <div>
              {expanded && (
                <div className='flex flex-col gap-4 p-4'>
                  <div className='relative flex flex-col gap-2'>
                    {issues === undefined ||
                      (issues.length === 0 && (
                        <div className='text-gray-4 flex flex-col items-center justify-center gap-1 py-8'>
                          <span className='text-label-md font-medium'>스프린트가 비어있습니다</span>
                          <span className='text-label-sm'>킷에서 이슈를 추가해 시작해보세요</span>
                        </div>
                      ))}

                    {issues &&
                      issues.map((issue, index) => {
                        return (
                          <Draggable
                            key={`sprint-${sprint.id}-issue-${issue.id}-${index}`}
                            draggableId={`sprint-${sprint.id}-issue-${issue.id}`}
                            index={index}
                            isDragDisabled={sprint.sprintStatus === SprintStatus.COMPLETED}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <IssueCard
                                  isError={
                                    startError?.invalidIssues
                                      .map((issue) => issue.id)
                                      .includes(issue.id) ?? false
                                  }
                                  issue={issue}
                                  onClick={() => openIssueModal(issue)}
                                  onDelete={() => removeIssue(issue.id)}
                                  draggable={sprint.sprintStatus !== SprintStatus.COMPLETED}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}

                    {provided.placeholder}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    </Droppable>
  );
};

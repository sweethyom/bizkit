import { IssueDetailModal, useIssueModalStore } from '@/widgets/issue-detail-modal';

import { EpicForm, useEpic } from '@/entities/epic';
import { moveIssueToSprint, useIssueStore } from '@/entities/issue';
import { SprintForm, SprintStatus, useSprint } from '@/entities/sprint';

import { Button } from '@/shared/ui';

import { EmptyCard } from './card/EmptyCard';
import { EpicCard } from './card/EpicCard';
import { SkeletonCard } from './card/SkeletonCard';
import { SprintCard } from './card/SprintCard';
import { CompleteSprintModal } from './modal/CompleteSprintModal';

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const BacklogPage = () => {
  const { projectId } = useParams();

  const {
    sprints,
    isLoading: isLoadingSprints,
    startSprint,
    completeSprint,
    setSprints,
  } = useSprint(Number(projectId));
  const [isCreateSprintFormOpen, setIsCreateSprintFormOpen] = useState(false);
  const [isCompleteSprintModalOpen, setIsCompleteSprintModalOpen] = useState(false);
  const [completeTargetSprintId, setCompleteTargetSprintId] = useState<number | null>(null);

  const {
    epics,
    getEpics,
    isLoading: isLoadingEpics,
    onDeleteIssue,
    setEpics: epicSetEpics,
  } = useEpic(Number(projectId));
  const [isCreateEpicFormOpen, setIsCreateEpicFormOpen] = useState(false);

  const [startTargetSprintId, setStartTargetSprintId] = useState<number | null>(null);
  const [startDueDate, setStartDueDate] = useState<string>('');

  useEffect(() => {
    getEpics();
  }, [getEpics]);

  const { isOpen: isIssueModalOpened } = useIssueModalStore();

  const { issues, moveIssue } = useIssueStore();

  const [dragSource, setDragSource] = useState<string | null>(null);

  const handleMoveIssue = async (result: DropResult) => {
    if (result.destination === null) return;

    const issueId = Number(result.draggableId.split('-').pop());

    const from = {
      type: result.draggableId.split('-')[0] as 'sprint' | 'epic',
      id: Number(result.draggableId.split('-')[1]),
      index: result.source.index,
    };

    if (result.destination.droppableId === 'epic-backlog') {
      const targetIssue = issues.sprint[from.id][from.index];

      const to = {
        type: 'epic' as 'sprint' | 'epic',
        id: targetIssue.epic!.id,
        index: result.destination.index,
      };

      moveIssue(issueId, from, to);

      try {
        await moveIssueToSprint(issueId, to.type === 'sprint' ? to.id : 0);
        epicSetEpics(
          epics.map((epic) => {
            if (epic.id === to.id) {
              return { ...epic, cntRemainIssues: epic.cntRemainIssues + 1 };
            }
            if (epic.id === from.id) {
              return { ...epic, cntRemainIssues: epic.cntRemainIssues - 1 };
            }
            return epic;
          }),
        );
      } catch (error) {
        console.error(error);
      }

      return;
    }

    const to = {
      type: result.destination.droppableId.split('-')[0] as 'sprint' | 'epic',
      id: Number(result.destination.droppableId.split('-')[1]),
      index: result.destination.index,
    };

    moveIssue(issueId, from, to);

    try {
      await moveIssueToSprint(issueId, to.type === 'sprint' ? to.id : 0);
      epicSetEpics(
        epics.map((epic) => {
          if (epic.id === to.id) {
            return { ...epic, cntRemainIssues: epic.cntRemainIssues + 1 };
          }
          if (epic.id === from.id) {
            return { ...epic, cntRemainIssues: epic.cntRemainIssues - 1 };
          }
          return epic;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSprint = (sprintId: number) => {
    setSprints(sprints.filter((s) => s.id !== sprintId));
  };

  const handleDeleteEpic = (epicId: number) => {
    epicSetEpics(epics.filter((e) => e.id !== epicId));
  };

  return (
    <DragDropContext
      onDragStart={(start) => setDragSource(start.source.droppableId)}
      onDragEnd={(result) => {
        setDragSource(null);
        handleMoveIssue(result);
      }}
    >
      <div className='flex flex-col gap-4'>
        <div className='bg-background-secondary flex items-center justify-between p-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-heading-xs font-bold'>프로젝트 백로그</h1>
            <p className='text-label-lg text-gray-5'>프로젝트 작업 목록을 관리하세요</p>
          </div>

          <div className='flex items-center gap-2'>
            {!isLoadingSprints && sprints.length > 0 && (
              <Button onClick={() => setIsCreateSprintFormOpen(true)}>
                <Plus />새 스프린트
              </Button>
            )}
          </div>
        </div>

        <section className='bg-background-primary flex justify-between gap-4 p-4'>
          <section className='flex flex-1/2 flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-primary h-6 w-1 rounded-full' />
              <h2 className='text-label-xl'>스프린트</h2>
            </div>

            <div className='flex flex-col gap-3'>
              {isCreateSprintFormOpen && (
                <SprintForm
                  projectId={Number(projectId)}
                  handleVisibility={() => setIsCreateSprintFormOpen(false)}
                />
              )}

              {isLoadingSprints ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonCard key={index} for='sprint' />
                ))
              ) : sprints.length === 0 && !isCreateSprintFormOpen ? (
                <EmptyCard
                  type='sprint'
                  title='스프린트가 비어있습니다'
                  description='새로운 스프린트를 추가해 시작해보세요.'
                  actionText='새 스프린트'
                  onActionClick={() => setIsCreateSprintFormOpen(true)}
                />
              ) : (
                sprints
                  .slice()
                  .sort((a, b) => {
                    const statusOrder = {
                      [SprintStatus.ONGOING]: 0,
                      [SprintStatus.READY]: 1,
                      [SprintStatus.COMPLETED]: 2,
                    };

                    return statusOrder[a.sprintStatus] - statusOrder[b.sprintStatus];
                  })
                  .map((sprint) => (
                    <SprintCard
                      key={sprint.id}
                      sprint={sprint}
                      onStartSprint={() => {
                        const defaultDate = (() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 14);
                          return d.toISOString().slice(0, 10);
                        })();
                        setStartTargetSprintId(sprint.id);
                        setStartDueDate(defaultDate);
                      }}
                      onCompleteSprint={() => {
                        setCompleteTargetSprintId(sprint.id);
                        setIsCompleteSprintModalOpen(true);
                      }}
                      onDeleteSprint={handleDeleteSprint}
                      dragSource={dragSource}
                    />
                  ))
              )}
              {startTargetSprintId !== null && (
                <div className='bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black'>
                  <div className='flex min-w-[320px] flex-col gap-4 rounded-lg bg-white p-6 shadow-lg'>
                    <h2 className='text-lg font-bold'>스프린트 시작</h2>
                    <label className='text-sm font-medium'>예상 종료일</label>
                    <input
                      type='date'
                      className='rounded border px-2 py-1'
                      value={startDueDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setStartDueDate(e.target.value)}
                    />
                    <div className='mt-4 flex justify-end gap-2'>
                      <button
                        className='bg-primary rounded px-4 py-2 text-white'
                        onClick={async () => {
                          await startSprint(startTargetSprintId, startDueDate);
                          setStartTargetSprintId(null);
                        }}
                      >
                        시작
                      </button>
                      <button
                        className='rounded bg-gray-200 px-4 py-2 text-gray-700'
                        onClick={() => setStartTargetSprintId(null)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className='flex flex-1/2 flex-col gap-4'>
            <div className='relative flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='bg-point h-6 w-1 rounded-full' />
                <h2 className='text-label-xl'>백로그</h2>
              </div>

              {!isLoadingEpics && epics.length > 0 && (
                <Button
                  className='absolute top-1/2 right-0 -translate-y-1/2'
                  variant='outline'
                  size='md'
                  color='point'
                  onClick={() => setIsCreateEpicFormOpen(true)}
                >
                  <Plus />
                  <span>에픽 추가</span>
                </Button>
              )}
            </div>

            <Droppable droppableId='epic-backlog'>
              {(provided, snapshot) => (
                <div
                  className={`relative flex h-full flex-col gap-3 transition-colors duration-200`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {isCreateEpicFormOpen && (
                    <EpicForm
                      projectId={Number(projectId)}
                      handleVisibility={() => setIsCreateEpicFormOpen(false)}
                    />
                  )}

                  {isLoadingEpics ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonCard key={index} for='epic' />
                    ))
                  ) : epics.length === 0 && !isCreateEpicFormOpen ? (
                    <EmptyCard
                      type='epic'
                      title='에픽이 비어있습니다'
                      description='새로운 에픽을 추가해 시작해보세요.'
                      actionText='새 에픽'
                      onActionClick={() => setIsCreateEpicFormOpen(true)}
                    />
                  ) : (
                    epics.map((epic) => (
                      <EpicCard
                        key={epic.id}
                        epic={epic}
                        onDeleteIssue={onDeleteIssue}
                        onDeleteEpic={handleDeleteEpic}
                      />
                    ))
                  )}

                  {snapshot.isDraggingOver && (
                    <div className='bg-gray-0/60 border-md absolute top-0 right-0 bottom-0 left-0'>
                      <div className='flex h-full w-full content-center items-center'>
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </section>
        </section>
      </div>

      {isIssueModalOpened && <IssueDetailModal />}
      {isCompleteSprintModalOpen && completeTargetSprintId !== null && (
        <CompleteSprintModal
          closeModal={() => {
            setIsCompleteSprintModalOpen(false);
            setCompleteTargetSprintId(null);
          }}
          currentSprintId={completeTargetSprintId}
          incompleteIssues={(issues.sprint[completeTargetSprintId] || [])
            .filter((issue) => issue.issueStatus !== 'DONE')
            .map((issue) => ({ id: issue.id }))}
          sprints={sprints}
          onComplete={async (toSprintId: number) => {
            console.log('completeSprint', completeTargetSprintId, toSprintId);
            await completeSprint(completeTargetSprintId, toSprintId);
            setIsCompleteSprintModalOpen(false);
            setCompleteTargetSprintId(null);
          }}
        />
      )}
    </DragDropContext>
  );
};

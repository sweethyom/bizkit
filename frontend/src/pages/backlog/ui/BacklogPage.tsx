import { IssueDetailModal, useIssueModalStore } from '@/widgets/issue-detail-modal';

import { deleteEpic, EpicForm, useEpic } from '@/entities/epic';
import { moveIssueToSprint, useIssueStore } from '@/entities/issue';
import { sprintApi, SprintForm, SprintStatus, useSprint } from '@/entities/sprint';

import { AlertModal, Button, ConfirmModal } from '@/shared/ui';

import { EmptyCard } from './card/EmptyCard';
import { EpicCard } from './card/EpicCard';
import { SkeletonCard } from './card/SkeletonCard';
import { SprintCard } from './card/SprintCard';
import { CompleteSprintModal } from './modal/CompleteSprintModal';

import { Issue, Sprint } from '@/shared/model';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { StartSprintModal } from './modal/StartSprintModal';

export const BacklogPage = () => {
  const { projectId } = useParams();

  const {
    sprints,
    isLoading: isLoadingSprints,
    startSprintError,
    validateSprint,
    startSprint,
    completeSprint,
    setSprints,
    setStartSprintError,
  } = useSprint(Number(projectId));

  const {
    epics,
    getEpics,
    isLoading: isLoadingEpics,
    onDeleteIssue,
    setEpics: epicSetEpics,
  } = useEpic(Number(projectId));

  const [isCreateSprintFormOpen, setIsCreateSprintFormOpen] = useState(false);
  const [isCompleteSprintModalOpen, setIsCompleteSprintModalOpen] = useState(false);

  const [isCreateEpicFormOpen, setIsCreateEpicFormOpen] = useState(false);

  const [startTargetSprintId, setStartTargetSprintId] = useState<number | null>(null);
  const [completeTargetSprintId, setCompleteTargetSprintId] = useState<number | null>(null);

  const { issues, moveIssue, setIssues } = useIssueStore();
  const { isOpen: isIssueModalOpened } = useIssueModalStore();

  const [dragSource, setDragSource] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAdditionalAlert, setShowAdditionalAlert] = useState(false);

  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const [additionalAlertInfo, setAdditionalAlertInfo] = useState<{
    title: string;
    description: React.ReactNode;
    onConfirm: () => void;
  }>({
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const handleMoveIssue = useCallback(
    async (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;

      const idParts = draggableId.split('-');
      const issueId = Number(idParts.at(-1));
      const fromType = idParts[0] as 'sprint' | 'epic';
      const fromId = Number(idParts[1]);

      const from = {
        type: fromType as 'sprint' | 'epic',
        id: fromId,
        index: source.index,
      };

      const isSameLocation =
        destination.droppableId === source.droppableId && destination.index === source.index;
      if (isSameLocation) return;

      // 목적지가 epic-backlog인 경우 (sprint → epic only)
      const isToEpicBacklog = destination.droppableId === 'epic-backlog';
      const fromIssues = issues[from.type][from.id];
      const targetIssue = fromIssues[from.index];

      // epic → sprint: epic count 감소 & 상태 변경
      if (from.type === 'epic') {
        const epic = epics.find((e) => e.id === from.id);
        if (!epic) return;

        targetIssue.issueStatus = 'TODO';
        epicSetEpics(
          epics.map((e) =>
            e.id === epic.id ? { ...e, cntRemainIssues: e.cntRemainIssues - 1 } : e,
          ),
        );
      }

      if (isToEpicBacklog) {
        if (from.type === 'epic') return;

        const epicId = targetIssue.epic?.id;
        if (!epicId) return;

        targetIssue.issueStatus = 'UNASSIGNED';

        const to = { type: 'epic' as const, id: epicId, index: destination.index };
        moveIssue(issueId, from, to);

        try {
          await moveIssueToSprint(issueId, null);
          const epic = epics.find((e) => e.id === epicId);
          if (!epic) return;

          epicSetEpics(
            epics.map((e) =>
              e.id === epic.id ? { ...e, cntRemainIssues: e.cntRemainIssues + 1 } : e,
            ),
          );
        } catch (err) {
          console.error(err);
        }

        return;
      }

      // 목적지가 epic이 아닌 일반 sprint or epic으로 이동하는 경우
      const [toType, toIdStr] = destination.droppableId.split('-');
      const to = {
        type: toType as 'sprint' | 'epic',
        id: Number(toIdStr),
        index: destination.index,
      };

      if (from.type === to.type && from.id === to.id) return;

      moveIssue(issueId, from, to);

      try {
        await moveIssueToSprint(issueId, to.type === 'sprint' ? to.id : null);
      } catch (err) {
        console.error(err);
      }
    },
    [epics, issues, moveIssue, epicSetEpics],
  );

  const handleCompleteSprintConfirmation = (sprintId: number, incompleteIssues: Issue[]) => {
    setCompleteTargetSprintId(sprintId);

    if (incompleteIssues.length > 0) {
      setIsCompleteSprintModalOpen(true);
      return;
    }

    handleCompleteSprint(sprintId, null);
  };

  const handleCompleteSprint = async (sprintId: number, toSprintId: number | null) => {
    if (!sprintId) return;

    await completeSprint(sprintId, toSprintId);
    setIsCompleteSprintModalOpen(false);
    setCompleteTargetSprintId(null);
  };

  const handleDeleteSprintConfirmation = async (sprint: Sprint) => {
    if (sprint.sprintStatus === SprintStatus.ONGOING) {
      setShowAlert(true);
      setAlertInfo({
        title: '🚨 스프린트 삭제',
        description: '스프린트를 종료한 후 삭제해주세요',
        onConfirm: () => setShowAlert(false),
      });
      return;
    }

    setAlertInfo({
      title: '스프린트 삭제',
      description: '해당 스프린트에 할당된 모든 이슈가 삭제됩니다.',
      onConfirm: () => {
        handleDeleteSprint(sprint);
      },
    });
    setShowConfirm(true);
  };

  const handleDeleteSprint = async (sprint: Sprint) => {
    if (!sprint) return;

    try {
      await sprintApi.deleteSprint(sprint.id);

      issues.sprint[sprint.id]?.forEach((issue) => {
        if (!issue.epic?.id) return;

        const epic = epics.find((e) => e.id === issue.epic?.id);
        if (!epic) return;

        epic.cntTotalIssues -= 1;
      });

      setSprints(sprints.filter((s) => s.id !== sprint.id));
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleDeleteEpic = (epicId: number) => {
    console.log('handleDeleteEpic', epicId);

    setAlertInfo({
      title: '킷 삭제',
      description: '해당 킷에 할당된 모든 이슈가 삭제됩니다.',
      onConfirm: async () => {
        await deleteEpic(epicId);

        epicSetEpics(epics.filter((e) => e.id !== epicId));

        sprints.forEach((s) => {
          issues.sprint[s.id]?.forEach((issue) => {
            if (issue.epic?.id === epicId) {
              issues.sprint[s.id] = issues.sprint[s.id]?.filter((i) => i.id !== issue.id);
            }
          });

          setIssues('sprint', s.id, issues.sprint[s.id] || []);
        });

        setShowAlert(false);
        setAlertInfo({
          title: '',
          description: '',
          onConfirm: () => {},
        });
        setShowConfirm(false);
      },
    });
    setShowConfirm(true);
  };

  useEffect(() => {
    getEpics();
  }, [getEpics]);

  return (
    <DragDropContext
      onDragStart={(start) => setDragSource(start.source.droppableId)}
      onDragEnd={(result) => {
        setDragSource(null);
        handleMoveIssue(result);
      }}
    >
      <div className='flex flex-col'>
        <div className='bg-background-secondary flex items-center justify-between px-12 py-6'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-heading-xs font-bold'>프로젝트 스택</h1>
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

        <section className='bg-background-primary flex justify-between gap-6 px-12 py-6 pb-30'>
          <section className='flex flex-1/2 flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-primary h-6 w-1 rounded-full' />
              <h2 className='text-label-xl font-semibold'>스프린트</h2>
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
                      startError={startSprintError}
                      key={sprint.id}
                      sprint={sprint}
                      onStartSprint={async () => {
                        const result = await validateSprint(sprint.id);

                        if (!result) {
                          setAlertInfo({
                            title: '🚨 스프린트 시작',
                            description:
                              '스프린트 내 모든 이슈의 정보가 입력되어 있어야 합니다. 누락된 이슈가 있습니다.',
                            onConfirm: () => {
                              setShowAlert(false);
                              setAlertInfo({
                                title: '',
                                description: '',
                                onConfirm: () => {},
                              });
                            },
                          });
                          setShowAlert(true);

                          return;
                        }

                        setStartTargetSprintId(sprint.id);
                      }}
                      onCompleteSprint={(incompleteIssues: Issue[]) => {
                        handleCompleteSprintConfirmation(sprint.id, incompleteIssues);
                      }}
                      onDeleteSprint={handleDeleteSprintConfirmation}
                      dragSource={dragSource}
                    />
                  ))
              )}
            </div>
          </section>

          <section className='flex flex-1/2 flex-col gap-4'>
            <div className='relative flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='bg-point h-6 w-1 rounded-full' />
                <h2 className='text-label-xl font-semibold'>스택</h2>
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
                  <span>킷 추가</span>
                </Button>
              )}
            </div>

            <Droppable droppableId='epic-backlog'>
              {(provided, snapshot) => (
                <div
                  className={`relative flex h-full flex-col gap-3 transition-colors duration-200`}
                >
                  <div
                    className='bg-gray-4/40 border-md absolute top-0 left-0 z-50 h-full w-full rounded-md px-4 py-8'
                    style={{ visibility: snapshot.isDraggingOver ? 'visible' : 'hidden' }}
                  >
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className='h-full w-full'
                    >
                      {provided.placeholder}
                    </div>
                  </div>

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
                      title='스택이 비어있습니다'
                      description='새로운 킷을 추가해 시작해보세요.'
                      actionText='새 킷'
                      onActionClick={() => setIsCreateEpicFormOpen(true)}
                    />
                  ) : (
                    epics.map((epic) => (
                      <EpicCard
                        key={epic.id}
                        epic={epic}
                        onDeleteIssue={onDeleteIssue}
                        onDeleteEpic={handleDeleteEpic}
                        dragSource={dragSource}
                      />
                    ))
                  )}
                </div>
              )}
            </Droppable>
          </section>
        </section>
      </div>

      {isIssueModalOpened && <IssueDetailModal />}

      {startTargetSprintId !== null && (
        <StartSprintModal
          closeModal={() => setStartTargetSprintId(null)}
          startSprint={async (dueDate) => {
            await startSprint(startTargetSprintId, dueDate);
            setStartTargetSprintId(null);
          }}
        ></StartSprintModal>
      )}

      {isCompleteSprintModalOpen && completeTargetSprintId !== null && (
        <CompleteSprintModal
          closeModal={() => {
            setIsCompleteSprintModalOpen(false);
            setCompleteTargetSprintId(null);
          }}
          incompleteIssues={(issues.sprint[completeTargetSprintId] || []).filter(
            (issue) => issue.issueStatus !== 'DONE',
          )}
          sprints={sprints}
          onComplete={async (toSprintId: number | null) => {
            await handleCompleteSprint(completeTargetSprintId, toSprintId);
          }}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          title={alertInfo.title}
          description={alertInfo.description}
          onConfirm={() => alertInfo.onConfirm()}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showAlert && (
        <AlertModal
          title={alertInfo.title}
          description={alertInfo.description}
          onConfirm={() => alertInfo.onConfirm()}
          additionalButton={
            alertInfo.title === '🚨 스프린트 시작'
              ? {
                  label: '자세히 보기',
                  onClick: () => {
                    setShowAlert(false);
                    setAdditionalAlertInfo({
                      title: '정보가 누락된 이슈 목록',
                      description: (
                        <div className='border-gray-2 h-64 overflow-x-clip overflow-y-auto rounded-md border p-1'>
                          {startSprintError?.invalidIssues.length || 0 > 0 ? (
                            startSprintError?.invalidIssues.map((issue, index) => (
                              <div
                                key={index}
                                className='mb-1 cursor-pointer rounded-md p-3 transition-colors hover:bg-gray-100'
                                onClick={() => {
                                  setStartSprintError({
                                    ...startSprintError,
                                    invalidIssues: startSprintError?.invalidIssues.filter(
                                      (i) => i.id === issue.id,
                                    ),
                                  });
                                }}
                              >
                                <div className='flex items-center'>
                                  <div className='mr-3 h-2 w-2 rounded-full bg-red-500'></div>
                                  <span>{issue.name}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className='p-3 text-center text-gray-500'>
                              검색 결과가 없습니다
                            </div>
                          )}
                        </div>
                      ),
                      onConfirm: () => {
                        setShowAdditionalAlert(false);
                      },
                    });
                    setShowAdditionalAlert(true);
                  },
                }
              : undefined
          }
        />
      )}

      {showAdditionalAlert && (
        <AlertModal
          title={additionalAlertInfo.title}
          description={additionalAlertInfo.description}
          onConfirm={() => additionalAlertInfo.onConfirm()}
        />
      )}
    </DragDropContext>
  );
};

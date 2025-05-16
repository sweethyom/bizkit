import { useIssueStore } from '@/pages/backlog/model/useIssueStore';

import { EpicForm, useEpic } from '@/entities/epic';
import { IssueDetailModal } from '@/entities/issue';
import { SprintForm, SprintStatus, useSprint } from '@/entities/sprint';

import { Button } from '@/shared/ui';

import { EmptyCard } from './card/EmptyCard';
import { EpicCard } from './card/EpicCard';
import { SkeletonCard } from './card/SkeletonCard';
import { SprintCard } from './card/SprintCard';

import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';

export const BacklogPage = () => {
  const { projectId } = useParams();

  const { sprints, isLoading: isLoadingSprints } = useSprint(Number(projectId));
  const { epics, isLoading: isLoadingEpics } = useEpic(Number(projectId));

  const [isCreateEpicFormOpen, setIsCreateEpicFormOpen] = useState(false);
  const [isCreateSprintFormOpen, setIsCreateSprintFormOpen] = useState(false);

  const { moveIssue } = useIssueStore();

  const handleMoveIssue = (result: DropResult) => {
    if (result.destination === null) return;

    const issueId = Number(result.draggableId.split('-').pop());

    const from = {
      type: result.source.droppableId.split('-')[0] as 'sprint' | 'epic',
      id: Number(result.source.droppableId.split('-')[1]),
      index: result.source.index,
    };

    const to = {
      type: result.destination.droppableId.split('-')[0] as 'sprint' | 'epic',
      id: Number(result.destination.droppableId.split('-')[1]),
      index: result.destination.index,
    };

    moveIssue(issueId, from, to);
  };

  return (
    <DragDropContext onDragEnd={handleMoveIssue}>
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
                  onSubmit={() => setIsCreateSprintFormOpen(false)}
                  onCancel={() => setIsCreateSprintFormOpen(false)}
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
                  .map((sprint) => <SprintCard key={sprint.id} sprint={sprint} />)
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

            <div className='flex flex-col gap-3'>
              {isCreateEpicFormOpen && (
                <EpicForm
                  projectId={Number(projectId)}
                  onSubmit={() => setIsCreateEpicFormOpen(false)}
                  onCancel={() => setIsCreateEpicFormOpen(false)}
                />
              )}

              {isLoadingEpics ? (
                Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} for='epic' />)
              ) : epics.length === 0 && !isCreateEpicFormOpen ? (
                <EmptyCard
                  type='epic'
                  title='에픽이 비어있습니다'
                  description='새로운 에픽을 추가해 시작해보세요.'
                  actionText='새 에픽'
                  onActionClick={() => setIsCreateEpicFormOpen(true)}
                />
              ) : (
                epics.map((epic) => <EpicCard key={epic.id} epic={epic} />)
              )}
            </div>
          </section>
        </section>
      </div>

      <IssueDetailModal />
    </DragDropContext>
  );
};

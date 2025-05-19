import { useIssues } from '@/pages/my-works/model/useIssues';

import { IssueCard } from '@/entities/issue';
import { ProjectForm, useProject } from '@/entities/project';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export const MyWorksPage = () => {
  const { projects } = useProject();
  const { todo, inProgress } = useIssues();

  const [showAddForm, setShowAddForm] = useState(false);

  const navigate = useNavigate();

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}/backlog`);
  };

  return (
    <div className='bg-background-secondary min-h-screen w-full p-4 md:p-8'>
      <h1 className='text-heading-md mb-8 font-bold text-black'>내 작업</h1>

      <div className='scrollbar-thin scrollbar-thumb-gray-200 overflow-x-auto p-1'>
        <div className='mb-8 flex gap-4 pb-2'>
          {showAddForm ? (
            <ProjectForm handleVisibility={() => setShowAddForm(false)} />
          ) : (
            <button
              className='border-primary bg-background-secondary text-primary hover:bg-primary-sub focus:ring-primary flex min-w-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 shadow-sm transition hover:scale-102 hover:shadow-md focus:ring-2 focus:outline-none'
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={32} />
              <span className='text-base font-medium'>프로젝트 추가</span>
            </button>
          )}

          {projects &&
            projects.map((project) => (
              <button
                key={project.id}
                className='border-gray-2 hover:border-primary hover:bg-primary-sub focus:ring-primary flex max-w-[220px] min-w-[180px] cursor-pointer flex-col items-center rounded-xl border bg-white p-6 shadow transition-all duration-200 hover:scale-102 hover:shadow-lg focus:ring-2 focus:outline-none'
                onClick={() => handleProjectClick(project.id)}
                type='button'
              >
                <div className='flex w-full items-center gap-4'>
                  <span className='bg-gray-3 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full'>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        className='size-12 object-cover'
                      />
                    ) : (
                      <span className='text-2xl text-gray-400'>📁</span>
                    )}
                  </span>
                  <div className='flex w-32 shrink-0 flex-col items-start gap-1'>
                    <span
                      className='text-label-xl max-w-full truncate font-semibold text-black'
                      title={project.name}
                    >
                      {project.name}
                    </span>
                    <div className='flex flex-col items-start'>
                      <span className='text-primary text-label-xxl font-bold'>
                        {project.todoCount}
                      </span>
                      <span className='text-gray-4 text-label-md'>나의 할 일 개수</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div>
          <h2 className='mb-4 flex items-center gap-2 text-xl font-semibold text-black'>
            <span className='text-primary'>📝</span> 할 일
          </h2>
          <div className='flex min-h-[200px] flex-col gap-4 rounded-xl bg-white/80 p-4 shadow-sm'>
            {todo.map((task) => (
              <IssueCard
                key={task.id}
                issue={task}
                showMenuButton={false}
                view='compact'
                onClick={() => {
                  if (task.project?.id) {
                    navigate(`/projects/${task.project?.id}/sprint?issueId=${task.id}`);
                  }
                }}
              />
            ))}

            {todo.length === 0 && (
              <div className='text-gray-3 py-8 text-center'>작업이 없습니다.</div>
            )}
          </div>
        </div>

        <div>
          <h2 className='mb-4 flex items-center gap-2 text-xl font-semibold text-black'>
            <span className='text-blue-500'>🚧</span> 진행 중
          </h2>
          <div className='flex min-h-[200px] flex-col gap-4 rounded-xl bg-white/80 p-4 shadow-sm'>
            {inProgress.map((task) => (
              <IssueCard
                key={task.id}
                issue={task}
                showMenuButton={false}
                view='compact'
                onClick={() => {
                  if (task.project?.id) {
                    navigate(`/projects/${task.project?.id}/sprint?issueId=${task.id}`);
                  }
                }}
              />
            ))}

            {inProgress.length === 0 && (
              <div className='text-gray-3 py-8 text-center'>작업이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

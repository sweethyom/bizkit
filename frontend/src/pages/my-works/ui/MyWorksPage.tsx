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
    <div className='bg-background-secondary min-h-screen w-full p-8'>
      <h1 className='text-heading-md mb-8 font-bold text-black'>내 작업</h1>

      <div className='mb-8 flex gap-4 overflow-x-auto'>
        {showAddForm ? (
          <ProjectForm handleVisibility={() => setShowAddForm(false)} />
        ) : (
          <button
            className='border-primary bg-background-secondary text-primary hover:bg-primary-sub flex min-w-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition'
            onClick={() => setShowAddForm(true)}
          >
            <Plus />
            <span className='text-sm'>프로젝트 추가</span>
          </button>
        )}

        {projects &&
          projects.map((project) => (
            <button
              key={project.id}
              className='border-gray-2 hover:border-gray-3 hover:bg-gray-2 flex min-w-[180px] cursor-pointer flex-col items-center rounded-lg border bg-white p-6 shadow transition hover:shadow-lg'
              onClick={() => handleProjectClick(project.id)}
              type='button'
            >
              <div className='flex items-center gap-4'>
                <span className='bg-gray-3 flex size-12 shrink-0 items-center justify-center rounded-full'>
                  {project.image && (
                    <img src={project.image} alt={project.name} className='size-12' />
                  )}
                </span>
                <div className='flex shrink-0 flex-col items-center gap-1'>
                  <span className='text-label-xl font-semibold text-black'>{project.name}</span>
                  <div className='flex flex-col items-center'>
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

      <div className='grid grid-cols-2 gap-8'>
        <div>
          <h2 className='mb-4 text-xl font-semibold text-black'>할 일</h2>
          <div className='flex flex-col gap-4 rounded-md bg-white p-4'>
            {todo.map((task) => (
              <IssueCard
                key={task.id}
                issue={task}
                showMenuButton={false}
                view='compact'
                onClick={() => {
                  alert(`navigate to '/projects/${task.project?.id}/sprint?issueId=${task.id}'`);
                }}
              />
            ))}

            {todo.length === 0 && (
              <div className='text-gray-3 py-8 text-center'>작업이 없습니다.</div>
            )}
          </div>
        </div>

        <div>
          <h2 className='mb-4 text-xl font-semibold text-black'>진행중</h2>
          <div className='flex flex-col gap-4 rounded-md bg-white p-4'>
            {inProgress.map((task) => (
              <IssueCard
                key={task.id}
                issue={task}
                showMenuButton={false}
                view='compact'
                onClick={() => {
                  alert(`navigate to '/projects/${task.project?.id}/sprint?issueId=${task.id}'`);
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

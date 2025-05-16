import { useProjectStore } from '@/shared/lib';

import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';

export const ProjectsMenu = ({ projectId }: { projectId?: number }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const { projects } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [projectId]);

  return (
    <div ref={menuRef} className='relative'>
      <button
        className='relative flex cursor-pointer items-center gap-1 py-2'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={clsx(projectId !== undefined && 'font-bold')}>
          {projectId !== undefined
            ? projects?.find((project) => project.id === Number(projectId))?.name
            : '프로젝트'}
        </span>
        <ChevronDown className='text-gray-4' size={20} />
      </button>

      {isOpen && (
        <div className='border-gray-2 absolute top-full flex min-w-sm flex-col overflow-hidden rounded-md border bg-white'>
          {projects?.length === 0 ? (
            <div className='text-gray-3 py-8 text-center'>프로젝트가 없습니다.</div>
          ) : (
            <>
              <h2 className='text-label-lg px-4 py-2 text-left font-bold'>최근 프로젝트</h2>

              <ul className='flex flex-col gap-2'>
                {projects?.map((project) => (
                  <li key={project.id}>
                    <NavLink
                      onClick={() => setIsOpen(false)}
                      className='hover:bg-background-secondary flex h-full w-full items-center gap-2 px-4 py-2'
                      to={`/projects/${project.id}/backlog`}
                    >
                      <div className='bg-background-tertiary size-8 rounded-full'></div>
                      <span>{project.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

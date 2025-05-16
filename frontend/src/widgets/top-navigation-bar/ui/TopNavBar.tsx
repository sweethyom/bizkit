import { projectApi } from '@/shared/api';
import { useProjectStore, useUserStore } from '@/shared/lib';
import { clsx } from 'clsx';
import { Layers, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { ProjectsMenu } from './ProjectsMenu';

const StyledNavLink = ({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(className, isActive ? 'font-bold text-black' : 'text-gray-4 hover:text-black')
      }
      end
    >
      {children}
    </NavLink>
  );
};

export const TopNavBar = () => {
  const { projectId } = useParams();
  const { user } = useUserStore();
  const { projects, setProjects } = useProjectStore();
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const getProjects = useCallback(async () => {
    const response = await projectApi.getMyProjectList();
    if (response?.result === 'SUCCESS') {
      setProjects(response.data || []);
    }
  }, [setProjects]);

  useEffect(() => {
    if (projects === null) {
      getProjects();
    }
  }, [getProjects, projects]);

  return (
    <nav className='bg-background-primary border-gray-2 text-label-lg flex w-full items-center justify-between border-b px-4 py-2 drop-shadow-sm'>
      <div className='flex items-center gap-6'>
        <NavLink
          className='text-heading-xs text-primary flex items-center gap-2 font-bold'
          to='/my-works'
        >
          <Layers size={24} />
          <span>BIZKIT</span>
        </NavLink>

        {user && (
          <ul className='flex items-center gap-4'>
            <ProjectsMenu projectId={projectId ? Number(projectId) : undefined} />

            {projectId !== undefined && (
              <>
                <li>
                  <StyledNavLink to={`/projects/${projectId}/sprint`}>활성 스프린트</StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to={`/projects/${projectId}/backlog`}>백로그</StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to={`/projects/${projectId}/burndown`}>번다운</StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to={`/projects/${projectId}/settings`}>설정</StyledNavLink>
                </li>
              </>
            )}
          </ul>
        )}
      </div>

      <div className='flex items-center gap-2'>
        {user ? (
          <span
            className='relative'
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <StyledNavLink
              className='bg-gray-2 border-gray-3 flex size-8 shrink-0 items-center justify-center rounded-full border'
              to='/'
            >
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt='profile'
                  className='size-full rounded-full object-cover'
                />
              ) : (
                <User size={24} />
              )}
            </StyledNavLink>
            {isProfileHovered && (
              <div className='border-gray-2 absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-white p-4 shadow-lg'>
                <div className='flex items-center gap-3'>
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl ?? '/images/default-profile.png'}
                      alt='profile'
                      className='h-10 w-10 rounded-full object-cover'
                    />
                  ) : (
                    <User size={40} />
                  )}
                  <div>
                    <div className='font-bold'>{user.nickname}</div>
                    <div className='text-sm text-gray-500'>{user.email}</div>
                  </div>
                </div>
              </div>
            )}
          </span>
        ) : (
          <>
            <StyledNavLink to='/signup'>회원가입</StyledNavLink>
            <StyledNavLink to='/signin'>로그인</StyledNavLink>
          </>
        )}
      </div>
    </nav>
  );
};

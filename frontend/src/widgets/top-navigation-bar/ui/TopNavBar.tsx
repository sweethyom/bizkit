import { getProjectDetail, getProjectList, useProjectStore } from '@/entities/project';

import { useUserStore } from '@/shared/lib';

import { ProfileMenu } from './PorfileMenu';
import { ProjectsMenu } from './ProjectsMenu';

import { clsx } from 'clsx';
import { Layers } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router';

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
  const profileIconRef = useRef<HTMLDivElement>(null);

  const getProjects = useCallback(async () => {
    const response = await getProjectList();
    if (response?.result === 'SUCCESS') {
      setProjects(response.data || []);
    }
  }, [setProjects]);

  const getProject = useCallback(async () => {
    await getProjectDetail(Number(projectId));
    // if (response?.result === 'SUCCESS') {
    // setProject(response.data);
    // }
  }, [projectId]);

  useEffect(() => {
    if (projects === null) {
      getProjects();
    }
  }, [getProjects, projects, getProject]);

  useEffect(() => {
    if (projectId) {
      getProject();
    }
  }, [projectId, getProject]);

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
          <div
            className='relative z-[99999]'
            onMouseEnter={() => setIsProfileHovered(true)}
            ref={profileIconRef}
          >
            <StyledNavLink
              className='bg-gray-2 flex size-8 shrink-0 items-center justify-center rounded-full'
              to='/profile'
            >
              <img
                src={user.profileImageUrl ?? '/images/default-profile.png'}
                alt='profile'
                className='size-full rounded-full object-cover'
              />
            </StyledNavLink>

            {isProfileHovered && (
              <ProfileMenu
                setIsProfileMenuHovered={setIsProfileHovered}
                anchorRef={profileIconRef}
              />
            )}
          </div>
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

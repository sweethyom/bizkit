import { getProjectDetail, getProjectList, Project, useProjectStore } from '@/entities/project';

import { ROUTES_MAP } from '@/shared/config';
import { useUserStore } from '@/shared/lib';
import { DropDownSection } from '@/shared/ui';

import { ProfileMenu } from './PorfileMenu';
import { ProjectsMenu } from './ProjectsMenu';

import { clsx } from 'clsx';
import { Layers } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router';

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
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);

  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const profileIconRef = useRef<HTMLDivElement>(null);

  const getProjects = useCallback(async () => {
    const response = await getProjectList();
    if (response?.result === 'SUCCESS') {
      setProjects(response.data || []);
    }
  }, [setProjects]);

  const getProject = useCallback(async () => {
    const response = await getProjectDetail(Number(projectId));
    if (response?.result === 'SUCCESS') {
      setProject(response.data || null);
    } else {
      alert('프로젝트를 찾을 수 없습니다.');
    }
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
                  <StyledNavLink to={`/projects/${projectId}/backlog`}>스택</StyledNavLink>
                </li>
                <li>
                  <DropDownSection
                    items={[
                      {
                        children: '팀 설정',
                        onClick: () => {
                          window.location.href = ROUTES_MAP.teamSettings.path.replace(
                            ':projectId',
                            String(projectId),
                          );
                        },
                      },
                      {
                        children: '컴포넌트 설정',
                        onClick: () => {
                          window.location.href = ROUTES_MAP.componentSettings.path.replace(
                            ':projectId',
                            String(projectId),
                          );
                        },
                      },
                      {
                        children: '프로젝트 설정',
                        onClick: () => {
                          window.location.href = ROUTES_MAP.projectSettings.path.replace(
                            ':projectId',
                            String(projectId),
                          );
                        },
                        disabled: !project?.leader,
                      },
                    ]}
                    button={(toggle) => {
                      const settingPaths = [
                        ROUTES_MAP.teamSettings.path.replace(':projectId', String(projectId)),
                        ROUTES_MAP.componentSettings.path.replace(':projectId', String(projectId)),
                        ROUTES_MAP.projectSettings.path.replace(':projectId', String(projectId)),
                      ];
                      const isActive = settingPaths.some((path) => location.pathname === path);
                      return (
                        <button
                          type='button'
                          className={clsx(
                            'flex items-center gap-1 rounded px-2 py-1 hover:text-black',
                            isActive ? 'font-bold text-black' : 'text-gray-4',
                          )}
                          onClick={toggle}
                        >
                          설정
                          <svg width='16' height='16' fill='none' viewBox='0 0 24 24'>
                            <path
                              d='M6 9l6 6 6-6'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </button>
                      );
                    }}
                  />
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

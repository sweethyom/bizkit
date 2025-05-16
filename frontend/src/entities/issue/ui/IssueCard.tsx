import { useIssueModalStore } from '@/entities/issue/lib/useIssueModalStore';
import { Issue } from '@/entities/issue/model/issue';

import { IconButton, TooltipSection } from '@/shared/ui';

import { clsx } from 'clsx';

interface IssueCardProps {
  issue: Issue;
  view?: 'compact' | 'detail';
  showMenuButton?: boolean;
  onClick?: () => void;
}

export const IssueCard = ({
  issue,
  view = 'detail',
  showMenuButton = true,
  onClick,
}: IssueCardProps) => {
  const { openModal } = useIssueModalStore();

  if (view === 'compact') {
    return (
      <div
        className='border-gray-2 hover:border-gray-3 flex cursor-pointer flex-col gap-2 rounded-lg border bg-white p-4'
        onClick={() => {
          if (onClick) {
            onClick();
          } else {
            openModal(issue);
          }
        }}
      >
        <div className='flex flex-col gap-2'>
          <div className='flex w-full items-center gap-4'>
            <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                <h3 className='text-label-lg'>{issue.name}</h3>
                <TooltipSection
                  info={['중요도', issue.issueImportance === 'HIGH' ? '높음' : '낮음'].join(' ')}
                >
                  <div
                    className={clsx('size-4 rounded-full', {
                      'bg-warning/80': issue.issueImportance === 'HIGH',
                      'bg-success/80': issue.issueImportance === 'LOW',
                    })}
                  />
                </TooltipSection>
              </div>

              <p className='text-label-sm text-gray-4'>{issue.key}</p>
            </div>

            {issue.project && (
              <TooltipSection info='프로젝트'>
                <div className='bg-gray-4 flex w-fit items-center rounded-sm px-2'>
                  <span className='text-label-sm text-white'>{issue.project.name}</span>
                </div>
              </TooltipSection>
            )}

            {issue.epic && (
              <TooltipSection info='에픽'>
                <div className='bg-point flex w-fit items-center rounded-sm px-2'>
                  <span className='text-label-sm text-white'>{issue.epic.name}</span>
                </div>
              </TooltipSection>
            )}

            {issue.bizPoint && (
              <TooltipSection info={['비즈니스 포인트', issue.bizPoint].join(': ')}>
                <div className='bg-point flex w-fit items-center rounded-sm px-2'>
                  <span className='text-label-sm text-white'>{issue.bizPoint}</span>
                </div>
              </TooltipSection>
            )}

            {showMenuButton && (
              <div className='relative ml-auto'>
                <IconButton icon='ellipsis' onClick={() => {}} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='border-gray-2 hover:border-primary/60 flex cursor-pointer flex-col gap-2 rounded-lg border bg-white p-4'
      onClick={() => openModal(issue)}
    >
      <div className='flex flex-col gap-2'>
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <h3 className='text-label-lg'>{issue.name}</h3>
              <TooltipSection
                info={['중요도', issue.issueImportance === 'HIGH' ? '높음' : '낮음'].join(' ')}
              >
                <div
                  className={clsx('size-4 rounded-full', {
                    'bg-warning/80': issue.issueImportance === 'HIGH',
                    'bg-success/80': issue.issueImportance === 'LOW',
                  })}
                />
              </TooltipSection>
            </div>

            <p className='text-label-sm text-gray-4'>{issue.key}</p>
          </div>

          {showMenuButton && (
            <div className='relative'>
              <IconButton icon='ellipsis' onClick={() => {}} />
            </div>
          )}
        </div>

        <TooltipSection info='에픽'>
          <div className='bg-point flex w-fit items-center rounded-sm px-1'>
            {issue.epic && (
              <div className='flex items-center gap-1'>
                <span className='text-label-sm text-white'>{issue.epic.name}</span>
              </div>
            )}
          </div>
        </TooltipSection>

        <div className='text-label-md flex w-full items-center'>
          <div className='flex w-full items-center gap-1'>
            <TooltipSection info='컴포넌트'>
              <span>{issue.component?.name || '없음'}</span>
            </TooltipSection>
            <span>•</span>
            <TooltipSection info='담당자'>
              <span>{issue.assignee?.nickname || '없음'}</span>
            </TooltipSection>
          </div>

          <TooltipSection info={['담당자', issue.assignee?.nickname || '없음'].join(': ')}>
            <div className='bg-gray-3 size-7 shrink-0 overflow-hidden rounded-full'>
              {issue.assignee?.profileImageUrl && (
                <img
                  className='size-full object-cover'
                  src={issue.assignee.profileImageUrl}
                  alt='이슈 담당자 프로필 이미지'
                />
              )}
            </div>
          </TooltipSection>
        </div>
      </div>
    </div>
  );
};

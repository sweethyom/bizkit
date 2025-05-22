import { Issue } from '@/entities/issue';

import { DropDownSection, IconButton, TooltipSection } from '@/shared/ui';

import { clsx } from 'clsx';

interface IssueCardProps {
  ref?: React.RefObject<HTMLDivElement | null> | null;
  issue: Issue | null;
  isError?: boolean;
  view?: 'compact' | 'detail';
  showMenuButton?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  draggable?: boolean;
}

export const IssueCard = ({
  ref,
  issue,
  isError,
  view = 'detail',
  showMenuButton = true,
  onClick,
  onDelete,
  draggable = true,
}: IssueCardProps) => {
  if (issue === null) {
    return <div className='bg-gray-2 h-full w-full' />;
  }

  if (view === 'compact') {
    return (
      <div
        className={clsx(
          'border-gray-2 hover:border-primary/30 flex flex-col gap-2 rounded-lg border bg-white p-4',
          draggable ? 'cursor-pointer' : 'cursor-default',
        )}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        <div ref={ref} className='flex flex-col gap-2'>
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
                  <span className='text-label-sm text-white'>
                    {typeof issue.project === 'object' ? issue.project.name : issue.project}
                  </span>
                </div>
              </TooltipSection>
            )}

            {issue.epic && (
              <TooltipSection info='킷'>
                <div className='bg-point flex w-fit items-center rounded-sm px-2'>
                  <span className='text-label-sm text-white'>
                    {typeof issue.epic === 'object' ? issue.epic.name : issue.epic}
                  </span>
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
      className={clsx(
        'border-gray-2 flex flex-col gap-2 rounded-lg border bg-white p-4',
        draggable
          ? 'hover:border-primary/30 cursor-pointer'
          : 'hover:border-gray-3/50 cursor-default',
        isError && '!border-warning/30 !shadow-warning/20 drop-shadow-warning/10 !shadow-md',
      )}
      style={{
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      }}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <div className='flex flex-col gap-2'>
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              {issue.issueStatus && issue.issueStatus !== 'UNASSIGNED' && (
                <TooltipSection info='진행 상황'>
                  <div
                    className={clsx('text-label-sm rounded-full px-2', {
                      'bg-gray-3/90 text-white': issue.issueStatus === 'TODO',
                      'bg-point/80 text-white': issue.issueStatus === 'IN_PROGRESS',
                      'bg-primary/80 text-white': issue.issueStatus === 'DONE',
                    })}
                  >
                    {issue.issueStatus === 'IN_PROGRESS'
                      ? '진행 중'
                      : issue.issueStatus === 'DONE'
                        ? '완료'
                        : '해야 할 일'}
                  </div>
                </TooltipSection>
              )}

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

          <DropDownSection
            items={[
              {
                children: '이슈 삭제',
                onClick: () => {
                  if (onDelete) {
                    onDelete();
                  }
                },
              },
            ]}
            button={(toggleVisibility) => (
              <IconButton
                icon='ellipsis'
                onClick={() => {
                  toggleVisibility();
                }}
              />
            )}
          />
        </div>

        <TooltipSection info='킷'>
          <div className='bg-point flex w-fit items-center rounded-sm px-1'>
            {issue.epic && (
              <div className='flex items-center gap-1'>
                <span className='text-label-sm text-white'>
                  {typeof issue.epic === 'object' ? issue.epic.name : issue.epic}
                </span>
              </div>
            )}
          </div>
        </TooltipSection>

        <div className='text-label-md flex w-full items-center'>
          <div className='flex w-full items-center gap-1'>
            <TooltipSection info='컴포넌트'>
              <span>
                {typeof issue.component === 'object' && issue.component !== null
                  ? issue.component.name || '없음'
                  : typeof issue.component === 'string'
                    ? issue.component
                    : '없음'}
              </span>
            </TooltipSection>
            <span>•</span>
            <TooltipSection info='담당자'>
              <span>{issue.assignee?.nickname || issue.user?.nickname || '없음'}</span>
            </TooltipSection>
          </div>

          <TooltipSection
            info={['담당자', issue.assignee?.nickname || issue.user?.nickname || '없음'].join(': ')}
          >
            <div className='size-7 shrink-0 overflow-hidden rounded-full'>
              {issue.assignee?.id || issue.user?.id ? (
                <img
                  className='size-full object-cover'
                  src={
                    issue.assignee?.profileImgUrl ||
                    issue.user?.profileImgUrl ||
                    '/images/default-profile.png'
                  }
                  alt='이슈 담당자 프로필 이미지'
                />
              ) : (
                <div className='bg-gray-2 size-full' />
              )}
            </div>
          </TooltipSection>
        </div>
      </div>
    </div>
  );
};

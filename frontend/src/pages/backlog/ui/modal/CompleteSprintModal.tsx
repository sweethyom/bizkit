import { Issue, useIssueStore } from '@/entities/issue';
import { SprintStatus } from '@/entities/sprint';

import { Modal } from '@/shared/ui';

import { clsx } from 'clsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MenuItem = ({
  type = 'sprint',
  children,
  onClick,
  disabled = false,
}: {
  type?: 'epic' | 'sprint';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <div
      className={clsx('hover:bg-background-tertiary shrink-0 overflow-hidden rounded-sm', {
        'pointer-events-none opacity-50': disabled,
      })}
      onClick={disabled ? undefined : onClick}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <div
        className={clsx('flex items-center gap-2 border-l-4 p-2 py-1', {
          'border-point': type === 'epic',
          'border-primary': type === 'sprint',
        })}
      >
        {children}
      </div>
    </div>
  );
};

interface CompleteSprintModalProps {
  closeModal: () => void;
  currentSprintId: number;
  incompleteIssues: Issue[];
  sprints: { id: number; name: string; sprintStatus: SprintStatus }[];
  onComplete?: (toSprintId: number | null) => void;
}

export const CompleteSprintModal = ({
  closeModal,
  currentSprintId,
  incompleteIssues,
  sprints,
  onComplete,
}: CompleteSprintModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { moveIssue } = useIssueStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  const handleMoveAllIssues = async (toSprintId: number | null) => {
    if (loading) return;
    setLoading(true);

    try {
      // await Promise.all(
      //   incompleteIssues.map((issue) =>
      //     moveIssueToSprint(issue.id, toSprintId ?? issue.epic?.id ?? 0),
      //   ),
      // );

      incompleteIssues.forEach((issue) => {
        console.log(issue);
        moveIssue(
          issue.id,
          { type: 'sprint', id: currentSprintId, index: 0 },
          {
            type: toSprintId === null ? 'epic' : 'sprint',
            id: toSprintId ?? issue.epic?.id ?? 0,
            index: 0,
          },
        );
      });

      if (onComplete) {
        onComplete(toSprintId);
      } else {
        closeModal();
      }
    } catch {
      alert('이슈 이동 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <Modal closeModal={closeModal}>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-label-xl font-bold'>스프린트 완료</h2>
          <p className='text-label-md text-gray-4 break-keep'>
            스프린트를 완료하기 전 스프린트 내 완료되지 않은 이슈들을 이동시켜야 합니다.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-label-md font-bold'>이동 가능한 위치</h3>
          <div className='flex max-h-[200px] flex-col gap-2 overflow-auto'>
            <MenuItem type='epic' onClick={() => handleMoveAllIssues(null)} disabled={loading}>
              스택
            </MenuItem>
            {sprints
              .filter(
                (sprint) =>
                  sprint.sprintStatus !== SprintStatus.COMPLETED &&
                  sprint.sprintStatus !== SprintStatus.ONGOING &&
                  sprint.id !== currentSprintId,
              )
              .map((sprint) => (
                <MenuItem
                  key={sprint.id}
                  onClick={() => handleMoveAllIssues(sprint.id)}
                  disabled={loading}
                >
                  {sprint.name}
                </MenuItem>
              ))}
          </div>
          {loading && <div className='py-2 text-center text-blue-500'>이슈 이동 중...</div>}
        </div>
      </div>
    </Modal>,
    document.body,
  );
};

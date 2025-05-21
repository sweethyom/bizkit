import { Sprint, SprintStatus } from '@/entities/sprint';
import { getByteSize } from '@/shared/lib/byteUtils';
import { IconButton, UnderlineInput } from '@/shared/ui';
import { ChangeEvent, useEffect, useRef } from 'react';
import { SprintCardStatusLabel } from './SprintCardStatusLabel';

interface SprintCardHeaderProps {
  sprint: Sprint;
  remainIssueCount?: number;
  isEditing: boolean;
  sprintName: string;
  setSprintName: (e: ChangeEvent<HTMLInputElement>) => void;
  onSave: (editedName: string) => void;
  onCancel: () => void;
}

export const SprintCardHeader = ({
  sprint,
  remainIssueCount,
  isEditing,
  sprintName,
  setSprintName,
  onSave,
  onCancel,
}: SprintCardHeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isEditing) {
      const handleInputFocus = (e: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(e.target as Node) &&
          !buttonRef.current?.contains(e.target as Node)
        ) {
          onCancel();
        }
      };

      document.addEventListener('click', handleInputFocus, true);

      return () => {
        document.removeEventListener('click', handleInputFocus, true);
      };
    }
  }, [isEditing, onCancel]);

  return (
    <div className='flex w-full flex-row items-start justify-between'>
      <div className='flex flex-1 flex-col'>
        <div className='flex items-center gap-2'>
          {isEditing ? (
            <>
              <UnderlineInput
                ref={inputRef}
                type='text'
                autoFocus
                className='text-label-lg w-full outline-none'
                value={sprintName}
                onChange={setSprintName}
                maxLength={40}
                onClick={(e) => e.stopPropagation()}
              />
              <span className='text-label-sm text-gray-4 whitespace-nowrap'>
                {getByteSize(sprintName)} / 40 byte
              </span>
              <IconButton
                ref={buttonRef}
                icon='check'
                size={20}
                onClick={() => {
                  onSave(sprintName);
                }}
                color='primary'
                disabled={sprintName.trim() === '' || getByteSize(sprintName) > 40}
              />
              <IconButton icon='x' size={20} onClick={onCancel} color='warning' />
            </>
          ) : (
            <span className='text-label-lg'>{sprint.name}</span>
          )}
        </div>

        {sprint.startDate && sprint.dueDate && (
          <p className='text-label-md text-gray-4 text-nowrap'>
            {sprint.startDate} ~{' '}
            {sprint.completedDate ? sprint.completedDate : sprint.dueDate + ' (예정)'}
          </p>
        )}

        <p className='text-label-md text-gray-4 text-nowrap'>
          {sprint.sprintStatus !== SprintStatus.COMPLETED && remainIssueCount !== undefined && (
            <>할 일 개수: {remainIssueCount}</>
          )}
        </p>
      </div>
      <div className='flex h-full flex-shrink-0 items-start'>
        <div style={{ width: 40 }} />
      </div>
      <SprintCardStatusLabel status={sprint.sprintStatus} />
    </div>
  );
};

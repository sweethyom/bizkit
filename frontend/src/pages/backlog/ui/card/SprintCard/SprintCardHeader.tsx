import { Sprint } from '@/entities/sprint';
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
    <>
      <div className='flex flex-col'>
        <h3 className='text-label-lg'>
          {isEditing ? (
            <div className='flex items-center'>
              <UnderlineInput
                ref={inputRef}
                type='text'
                autoFocus
                className='text-label-lg w-full outline-none'
                value={sprintName}
                onChange={setSprintName}
                onClick={(e) => e.stopPropagation()}
              />

              <IconButton
                ref={buttonRef}
                icon='check'
                size={20}
                onClick={() => {
                  console.log(sprintName);
                  onSave(sprintName);
                }}
                color='primary'
              />
              <IconButton icon='x' size={20} onClick={onCancel} color='warning' />
            </div>
          ) : (
            sprint.name
          )}
        </h3>
        <p className='text-label-md text-gray-4 text-nowrap'>
          {remainIssueCount !== undefined ? (
            <>할 일 개수: {remainIssueCount}</>
          ) : (
            <>열어서 확인해주세요.</>
          )}
        </p>
      </div>

      <SprintCardStatusLabel status={sprint.sprintStatus} />
    </>
  );
};

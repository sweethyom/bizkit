import { useSprintForm } from '@/entities/sprint/lib/useSprintForm';
import { cn } from '@/shared/lib';
import { Button, UnderlineInput } from '@/shared/ui';

interface SprintFormProps {
  projectId: number;
  onCancel: () => void;
  onSubmit: () => void;
}

export const SprintForm = ({ onCancel, onSubmit, projectId }: SprintFormProps) => {
  const { name, byteLength, isValid, handleNameChange, handleSubmit } = useSprintForm(projectId);

  return (
    <form
      className={cn(
        'border-gray-3 border-l-primary flex flex-col rounded-lg border border-l-6 shadow-sm',
      )}
      onSubmit={(e) => {
        handleSubmit(e);
        onSubmit();
      }}
    >
      <div className={cn('flex justify-between gap-4 p-4')}>
        <div className='flex w-full flex-col gap-1'>
          <UnderlineInput
            type='text'
            classNames='flex-1 text-label-lg mt-2'
            value={name}
            onChange={handleNameChange}
          />
          <p className='text-label-sm text-gray-4 self-end'>{byteLength} / 40 byte</p>
        </div>

        <div className={cn('flex shrink-0 gap-2')}>
          <Button size='sm' variant='solid' color='primary' type='submit' disabled={!isValid}>
            생성
          </Button>
          <Button type='button' size='sm' variant='outline' color='warning' onClick={onCancel}>
            취소
          </Button>
        </div>
      </div>
    </form>
  );
};

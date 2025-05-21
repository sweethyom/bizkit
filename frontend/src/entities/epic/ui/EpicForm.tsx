import { cn } from '@/shared/lib';
import { Button, UnderlineInput } from '@/shared/ui';
import { useEpicForm } from '../lib/useEpicForm';

interface EpicFormProps {
  projectId: number;
  handleVisibility: () => void;
}

export const EpicForm = ({ projectId, handleVisibility }: EpicFormProps) => {
  const { name, byteLength, isValid, handleNameChange, onCreate } = useEpicForm(projectId);

  return (
    <form
      className={cn(
        'border-gray-3 border-l-point flex flex-col rounded-lg border border-l-6 shadow-sm',
      )}
      onSubmit={(e) => {
        onCreate(e);
        handleVisibility();
      }}
    >
      <div className='flex justify-between gap-4 p-4'>
        <div className='flex w-full flex-col gap-1'>
          <UnderlineInput
            type='text'
            classNames='flex-1 !text-label-lg mt-2'
            value={name}
            onChange={handleNameChange}
          />
          <p className='text-label-sm text-gray-4 self-end'>{byteLength} / 40 byte</p>
        </div>

        <div className='flex shrink-0 gap-2'>
          <Button size='sm' variant='solid' color='point' type='submit' disabled={!isValid}>
            생성
          </Button>
          <Button
            type='button'
            size='sm'
            variant='outline'
            color='warning'
            onClick={handleVisibility}
          >
            취소
          </Button>
        </div>
      </div>
    </form>
  );
};

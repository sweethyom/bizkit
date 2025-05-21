import { useSprintForm } from '@/entities/sprint/lib/useSprintForm';
import { Button, UnderlineInput } from '@/shared/ui';

interface SprintFormProps {
  projectId: number;
  handleVisibility: () => void;
}

export const SprintForm = ({ handleVisibility, projectId }: SprintFormProps) => {
  const { name, byteLength, isValid, handleNameChange, onCreate } = useSprintForm(projectId);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate();
    handleVisibility();
  };

  return (
    <form
      className={
        'border-gray-3 border-l-primary flex flex-col rounded-lg border border-l-6 shadow-sm'
      }
      onSubmit={onSubmit}
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
          <Button size='sm' variant='solid' color='primary' type='submit' disabled={!isValid}>
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

import { useIssueForm } from '@/features/create-issue';
import { Button } from '@/shared/ui';

interface IssueFormProps {
  epicId: number;
  handleVisibility: () => void;
}

export const IssueForm = ({ epicId, handleVisibility }: IssueFormProps) => {
  const { issueName, byteLength, handleIssueNameChange, handleSubmit, isError } =
    useIssueForm(epicId);

  return (
    <form
      className='border-gray-2 bg-background-secondary flex min-w-[280px] flex-col gap-3 rounded-xl border px-4 py-3 shadow-sm'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        handleVisibility();
      }}
    >
      <label className='text-label-sm text-gray-4 mb-1 ml-1'>이슈 이름</label>
      <div className='flex items-center gap-2'>
        <input
          className='w-full rounded-md px-2 py-1.5 outline-none'
          placeholder='이슈 이름을 입력하세요'
          value={issueName}
          onChange={handleIssueNameChange}
        />
        <p className='text-label-sm text-gray-4 self-end'>{byteLength}/40byte</p>
      </div>

      <div className='mt-1 flex justify-end gap-2'>
        <Button
          type='button'
          color='warning'
          variant='outline'
          size='sm'
          onClick={handleVisibility}
        >
          취소
        </Button>
        <Button type='submit' disabled={isError} variant='solid' size='sm'>
          확인
        </Button>
      </div>
    </form>
  );
};

import { useProjectForm } from '@/entities/project/lib/useProjectForm';

import { FormEvent } from 'react';

export const ProjectForm = ({ handleVisibility }: { handleVisibility: () => void }) => {
  const {
    newProjectName,
    newProjectKey,
    error,
    handleProjectNameChange,
    handleProjectKeyChange,
    handleSubmit,
    resetForm,
  } = useProjectForm();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
    handleVisibility();
  };

  const handleCancel = () => {
    resetForm();
    handleVisibility();
  };

  return (
    <form
      className='border-primary flex min-w-[180px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-white p-6'
      onSubmit={onSubmit}
    >
      <input
        className='border-gray-2 focus:ring-primary w-full rounded border px-2 py-1 text-sm focus:ring-2 focus:outline-none'
        placeholder='프로젝트 이름'
        value={newProjectName}
        onChange={handleProjectNameChange}
        maxLength={20}
        autoFocus
      />

      <input
        className='border-gray-2 focus:ring-primary w-full rounded border px-2 py-1 text-sm focus:ring-2 focus:outline-none'
        placeholder='프로젝트 키'
        value={newProjectKey}
        onChange={handleProjectKeyChange}
      />

      {error && <span className='text-warning max-w-[200px] text-xs'>{error}</span>}

      <div className='mt-2 flex w-full gap-2'>
        <button
          type='submit'
          className='bg-primary hover:bg-primary-sub flex-1 cursor-pointer rounded py-1 text-sm font-semibold text-white transition'
        >
          생성
        </button>

        <button
          type='button'
          className='border-gray-3 text-gray-4 hover:bg-gray-1 flex-1 cursor-pointer rounded border bg-white py-1 text-sm font-semibold transition'
          onClick={handleCancel}
        >
          취소
        </button>
      </div>
    </form>
  );
};

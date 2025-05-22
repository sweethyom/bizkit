import { Modal } from '@/shared/ui';
import { useState } from 'react';

export const StartSprintModal = ({
  closeModal,
  startSprint,
}: {
  closeModal: () => void;
  startSprint: (dueDate: string) => Promise<void>;
}) => {
  const defaultDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  })();

  const [startDueDate, setStartDueDate] = useState(defaultDate);

  const handleStartSprint = async () => {
    await startSprint(startDueDate);
    closeModal();
  };

  return (
    <Modal closeModal={closeModal}>
      <div className='flex min-w-[320px] flex-col gap-4 rounded-lg bg-white'>
        <h2 className='text-lg font-bold'>스프린트 시작</h2>
        <label className='text-sm font-medium'>예상 종료일</label>
        <input
          type='date'
          className='rounded border px-2 py-1'
          value={startDueDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setStartDueDate(e.target.value)}
        />
        <div className='mt-4 flex justify-end gap-2'>
          <button
            className='bg-primary cursor-pointer rounded px-4 py-2 text-white'
            onClick={handleStartSprint}
          >
            시작
          </button>
          <button
            className='cursor-pointer rounded bg-gray-200 px-4 py-2 text-gray-700'
            onClick={closeModal}
          >
            취소
          </button>
        </div>
      </div>
    </Modal>
  );
};

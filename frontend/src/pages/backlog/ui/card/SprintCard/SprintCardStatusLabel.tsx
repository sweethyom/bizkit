import { SprintStatus } from '@/entities/sprint';
import { clsx } from 'clsx';

const STATUS_NAME = {
  [SprintStatus.READY]: '준비 중',
  [SprintStatus.ONGOING]: '진행 중',
  [SprintStatus.COMPLETED]: '완료',
};

export const SprintCardStatusLabel = ({ status }: { status: SprintStatus }) => {
  return (
    <div
      className={clsx(
        'text-label-md ml-auto shrink-0 rounded-full px-2',
        status === SprintStatus.READY && 'bg-gray-3 text-white',
        status === SprintStatus.ONGOING && 'bg-done text-white',
        status === SprintStatus.COMPLETED && 'bg-primary text-white',
      )}
    >
      {STATUS_NAME[status]}
    </div>
  );
};

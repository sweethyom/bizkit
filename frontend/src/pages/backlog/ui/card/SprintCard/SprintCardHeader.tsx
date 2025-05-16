import { Sprint } from '@/entities/sprint';
import { SprintCardStatusLabel } from './SprintCardStatusLabel';

interface SprintCardHeaderProps {
  sprint: Sprint;
  remainIssueCount?: number;
}

export const SprintCardHeader = ({ sprint, remainIssueCount }: SprintCardHeaderProps) => {
  return (
    <>
      <div className='flex flex-col'>
        <h3 className='text-label-lg'>{sprint.name}</h3>
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

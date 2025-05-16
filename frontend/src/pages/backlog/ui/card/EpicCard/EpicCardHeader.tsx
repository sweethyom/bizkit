import { Epic } from '@/entities/epic';
import { EpicCardProgressBar } from './EpicCardProgressBar';

interface EpicCardHeaderProps {
  epic: Epic;
}

export const EpicCardHeader = ({ epic }: EpicCardHeaderProps) => {
  return (
    <>
      <div className='flex flex-col'>
        <h3 className='text-label-lg'>{epic.name}</h3>
        <p className='text-label-md text-gray-4 text-nowrap'>
          전체 이슈: {epic.cntTotalIssues} | 남은 이슈: {epic.cntRemainIssues}
        </p>
      </div>

      <EpicCardProgressBar
        progress={((epic.cntRemainIssues || 0) / (epic.cntTotalIssues || 1)) * 100}
      />
    </>
  );
};

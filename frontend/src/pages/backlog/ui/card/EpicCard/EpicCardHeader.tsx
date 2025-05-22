import { Epic } from '@/entities/epic';
import { EpicCardProgressBar } from './EpicCardProgressBar';

interface EpicCardHeaderProps {
  epic: Epic;
}

export const EpicCardHeader = ({ epic }: EpicCardHeaderProps) => {
  const remainIssueCount = epic.cntRemainIssues || 0;
  const totalIssueCount = epic.cntTotalIssues || 0;

  return (
    <>
      <div className='flex flex-col'>
        <h3 className='text-label-lg'>{epic.name}</h3>
        <p className='text-label-md text-gray-4 text-nowrap'>
          전체 이슈: {epic.cntTotalIssues} | 남은 이슈: {epic.cntRemainIssues}
        </p>
      </div>

      <EpicCardProgressBar
        progress={((totalIssueCount - remainIssueCount || 0) / (totalIssueCount || 1)) * 100}
      />
    </>
  );
};

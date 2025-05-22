interface SprintBoardHeaderProps {
  activeFilter: string | null;
  filterName: string | null;
  totalFilteredCount: number;
}

export const SprintBoardHeader: React.FC<SprintBoardHeaderProps> = ({
  activeFilter,
  filterName,
  totalFilteredCount
}) => {
  return (
    <div className='bg-background-secondary flex items-center justify-between p-4'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-heading-xs font-bold'>스프린트 보드</h1>
        <p className='text-label-lg text-gray-5'>작업 상태를 한눈에 파악하고 관리하세요</p>
        {activeFilter && filterName && (
          <div className='mt-2 flex items-center'>
            <span className='mr-2 text-sm text-gray-600'>필터링 중:</span>
            <span className='bg-primary/10 text-primary inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium'>
              {filterName} ({totalFilteredCount}개 이슈)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

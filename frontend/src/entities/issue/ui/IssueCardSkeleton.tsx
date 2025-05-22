interface IssueCardSkeletonProps {
  view?: 'compact' | 'detail';
}

export const IssueCardSkeleton = ({ view = 'detail' }: IssueCardSkeletonProps) => {
  if (view === 'compact') {
    return (
      <div className='border-gray-2 flex animate-pulse flex-col gap-2 rounded-lg border bg-white p-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex w-full items-center gap-4'>
            <div className='flex flex-col gap-1'>
              <div className='bg-gray-2 h-5 w-24 rounded' /> {/* 이슈 이름 */}
              <div className='bg-gray-2 h-4 w-16 rounded' /> {/* 이슈 키 */}
            </div>
            <div className='bg-gray-2 size-4 rounded-full' /> {/* 중요도 */}
            <div className='bg-gray-2 h-5 w-16 rounded' /> {/* 프로젝트 */}
            <div className='bg-gray-2 h-5 w-16 rounded' /> {/* 에픽 */}
          </div>
        </div>
      </div>
    );
  }

  // detail view
  return (
    <div className='border-gray-3 flex animate-pulse flex-col gap-2 rounded-lg border bg-white p-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex w-full items-center justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-2'>
              <div className='bg-gray-2 h-5 w-24 rounded' /> {/* 이슈 이름 */}
            </div>
          </div>
        </div>
        <div className='bg-gray-2 h-5 w-20 rounded' /> {/* 에픽 */}
        <div className='mt-2 flex items-center gap-2'>
          <div className='bg-gray-2 size-7 rounded-full' /> {/* 담당자 프로필 */}
        </div>
      </div>
    </div>
  );
};

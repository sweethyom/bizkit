import { cn } from '@/shared/lib';

type SkeletonCardProps = {
  for?: 'epic' | 'sprint';
};

export const SkeletonCard = ({ for: forType = 'epic' }: SkeletonCardProps) => {
  return (
    <div
      className={cn('border-gray-3 flex animate-pulse flex-col rounded-lg border border-l-6', {
        'border-l-point': forType === 'epic',
        'border-l-primary': forType === 'sprint',
      })}
    >
      <div className='flex items-center gap-4 p-4'>
        {/* Chevron Skeleton */}
        <div className='bg-gray-2 h-5 w-5 animate-pulse rounded' />

        {/* Epic Name & Info Skeleton */}
        <div className='flex flex-col gap-2'>
          <div className='bg-gray-2 h-5 w-24 animate-pulse rounded' />
          <div className='bg-gray-2 h-4 w-36 animate-pulse rounded' />
        </div>

        {/* Progress Bar Skeleton */}
        <div className='relative ml-auto flex h-2 w-full max-w-[33%] overflow-hidden rounded-full bg-gray-100'>
          <div className='bg-gray-2 inset-0 h-full w-1/2 animate-pulse' />
        </div>
      </div>
    </div>
  );
};

import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyCardProps {
  type: 'epic' | 'sprint';
  title: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
  icon?: ReactNode;
}

export const EmptyCard = ({
  type,
  title,
  description,
  actionText,
  onActionClick,
  icon,
}: EmptyCardProps) => {
  return (
    <div className='bg-background-secondary border-gray-2 flex flex-col items-center justify-center rounded-lg border py-20'>
      {icon ? (
        <div className='mb-6'>{icon}</div>
      ) : (
        <div className='bg-gray-2 mb-6 rounded-full p-4'>
          <Plus className='text-gray-4 h-8 w-8' />
        </div>
      )}
      <h2 className='text-heading-md mb-2 font-bold text-black'>{title}</h2>
      {description && <p className='text-label-lg text-gray-4 mb-4'>{description}</p>}
      {actionText && onActionClick && (
        <button
          className={clsx(
            'text-label-lg flex cursor-pointer items-center gap-2 rounded px-6 py-2 font-semibold text-white transition',
            {
              'bg-primary hover:bg-primary/80': type === 'sprint',
              'bg-point hover:bg-point/80': type === 'epic',
            },
          )}
          onClick={onActionClick}
        >
          <Plus />
          {actionText}
        </button>
      )}
    </div>
  );
};

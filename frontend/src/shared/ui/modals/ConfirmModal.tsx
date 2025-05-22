import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const ConfirmModal = ({
  title,
  description,
  confirmButton,
  onCancel,
  className,
}: {
  title: string;
  description: string;
  confirmButton: {
    color: 'primary' | 'warning' | 'point';
    label: string;
    onClick: () => void;
  };
  onCancel: () => void;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onCancel]);

  return createPortal(
    <div className='animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div
        ref={containerRef}
        className={cn(
          'relative w-full max-w-sm rounded-xl bg-white p-6 shadow-lg',
          'border border-gray-200',
          'transform transition-all duration-200 ease-in-out',
          'dark:border-gray-800 dark:bg-gray-900',
          className,
        )}
      >
        {/* <button
          onClick={onCancel}
          className='absolute top-4 right-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800'
          aria-label='Close'
        >
          <X size={18} />
        </button> */}

        <div className='flex flex-col gap-2'>
          <h2 className='mb-2 text-xl font-semibold'>{title}</h2>
          <p className='text-gray-5'>{description}</p>
        </div>

        <div className='mt-8 flex justify-end gap-3'>
          <Button
            size='sm'
            variant='outline'
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium'
          >
            취소
          </Button>
          <Button
            size='sm'
            color={confirmButton.color as 'primary' | 'warning' | 'point'}
            onClick={confirmButton.onClick}
            className='px-4 py-2 text-sm font-medium'
          >
            {confirmButton.label}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

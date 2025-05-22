import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const AlertModal = ({
  title,
  description,
  confirmButton,
  className,
  additionalButton,
}: {
  title: string;
  description: React.ReactNode;
  confirmButton: {
    color: string;
    label: string;
    onClick: () => void;
  };
  className?: string;
  additionalButton?: {
    label: string;
    onClick: () => void;
  };
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        confirmButton.onClick();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        confirmButton.onClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [confirmButton, confirmButton.onClick]);

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
        <div className='flex flex-col gap-2'>
          <h2 className='mb-2 text-xl font-semibold'>{title}</h2>
          <div className='text-gray-5'>{description}</div>
        </div>

        <div className='mt-8 flex justify-end gap-3'>
          {additionalButton && (
            <Button
              size='sm'
              variant='outline'
              onClick={additionalButton.onClick}
              className='px-4 py-2 text-sm font-medium'
            >
              {additionalButton.label}
            </Button>
          )}

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

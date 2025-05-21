import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const CongratsModal = ({
  title,
  description,
  onConfirm,
  onCancel,
}: {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  return createPortal(
    <div className='animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <div
        ref={containerRef}
        className='relative flex w-full max-w-xs flex-col items-center gap-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl'
      >
        <div className='flex w-full flex-col items-center gap-2'>
          <div className='mb-2 text-4xl text-blue-500'>
            {/* {icon || <HiOutlineExclamationCircle />} */}
          </div>
          <div className='mb-1 text-lg font-bold text-gray-900'>{title}</div>
          {description && (
            <div className='text-center text-sm leading-relaxed text-gray-500'>{description}</div>
          )}
        </div>
        <div className='mt-2 flex w-full justify-end gap-3'>
          <button
            onClick={onCancel}
            className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-500 shadow-sm transition hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-gray-200 focus:outline-none'
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className='rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-300 focus:outline-none'
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

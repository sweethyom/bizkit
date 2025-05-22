import { X } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: ReactNode;
  closeModal: () => void;
}

export const Modal = ({ children, closeModal }: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  return createPortal(
    <div className='animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div ref={containerRef} className='relative w-full max-w-sm rounded-lg bg-white p-6'>
        <button
          className='absolute top-5 right-5 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100'
          onClick={closeModal}
          aria-label='닫기'
        >
          <X className='h-5 w-5' />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

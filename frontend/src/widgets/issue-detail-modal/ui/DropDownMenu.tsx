import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const DropDownMenu = ({
  anchorRef,
  options,
  value,
  onOpen,
  onClose,
  onSelect,
}: {
  anchorRef: React.RefObject<HTMLElement>;
  options: { label: string; value: number | string }[];
  value: number | string | null;
  onOpen?: () => void;
  onClose: () => void;
  onSelect: (value: number | string) => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (onOpen) onOpen();
  }, [onOpen]);

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) onClose();
    };

    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, [anchorRef, onClose]);

  if (pos.top === 0 && pos.left === 0) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        minWidth: pos.width,
        zIndex: 9999,
        maxHeight: 320,
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
      className='border-gray-2 animate-fadein rounded-md border bg-white shadow-2xl'
    >
      {options.length === 0 && (
        <div className='text-label-md flex h-full items-center justify-center p-4'>
          선택 가능한 옵션이 없습니다.
        </div>
      )}

      {options.map((opt, idx) => {
        const isSelected = opt.label === value;
        return (
          <div key={opt.value}>
            <div
              className='group hover:bg-primary/10 hover:text-primary active:bg-primary/20 text-label-md flex cursor-pointer items-center gap-2 px-4 py-2 text-base transition-colors duration-150'
              style={{
                fontWeight: isSelected ? 700 : 500,
                background: isSelected ? 'rgba(59,130,246,0.08)' : undefined,
                color: isSelected ? '#2563eb' : undefined,
              }}
              onClick={() => onSelect(opt.value)}
            >
              <span>{opt.label}</span>
              {isSelected && <Check size={16} />}
            </div>
            {idx < options.length - 1 && <div className='mx-3 h-px bg-gray-100' />}
          </div>
        );
      })}
    </div>,
    document.body,
  );
};

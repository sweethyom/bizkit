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
      }}
      className='border-gray-2 animate-fadein overflow-hidden rounded-xl border bg-white shadow-2xl'
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <div
            key={opt.value}
            className='hover:bg-primary/10 hover:text-primary active:bg-primary/20 cursor-pointer px-4 py-2 text-base font-medium transition-colors duration-100'
            style={{
              fontWeight: isSelected ? 700 : 500,
              background: isSelected ? 'rgba(59,130,246,0.08)' : undefined,
              color: isSelected ? '#2563eb' : undefined,
            }}
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
          </div>
        );
      })}
    </div>,
    document.body,
  );
};
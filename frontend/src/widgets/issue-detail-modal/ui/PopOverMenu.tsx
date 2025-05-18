import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const PopoverInput = ({
  anchorRef,
  value,
  onSave,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLElement>;
  value: number;
  onSave: (v: number) => void;
  onClose: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });
  const [val, setVal] = useState(value);
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
      if (!inputRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [anchorRef, onClose]);
  if (pos.top === 0 && pos.left === 0) return null;
  return createPortal(
    <input
      ref={inputRef}
      type='number'
      value={val}
      min={0}
      max={100}
      autoFocus
      style={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className='focus:ring-primary rounded border border-gray-200 px-2 py-1 text-sm shadow-lg outline-none focus:ring-2'
      onChange={(e) => setVal(Number(e.target.value))}
      onBlur={() => onSave(val)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSave(val);
      }}
    />,
    document.body,
  );
};

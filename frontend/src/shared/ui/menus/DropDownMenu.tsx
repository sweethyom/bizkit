import { clsx } from 'clsx';
import { ReactNode, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface DropDownItemProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const DropDownMenu = ({
  ref,
  items,
  toggleVisibility,
  anchorEl,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  items: DropDownItemProps[];
  toggleVisibility: () => void;
  anchorEl: HTMLElement | null;
}) => {
  // const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (anchorEl && ref.current) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - ref.current.offsetWidth,
      });
    }
  }, [anchorEl, items.length, ref]);

  if (!anchorEl) return null;

  return createPortal(
    <div
      ref={ref}
      className='border-gray-2 absolute z-100 mt-2 flex flex-col overflow-hidden rounded-md border bg-white shadow-md'
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        minWidth: anchorEl.offsetWidth,
      }}
    >
      {items.map((item, index) => {
        if (item.disabled) return null;

        return (
          <button
            key={index}
            className={clsx(
              'text-label-md w-full cursor-pointer p-2 px-4 text-left text-nowrap',
              'hover:bg-gray-2',
            )}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              toggleVisibility();
            }}
          >
            {item.children}
          </button>
        );
      })}
    </div>,
    document.body,
  );
};

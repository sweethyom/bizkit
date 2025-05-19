import { clsx } from 'clsx';
import { ReactNode } from 'react';

export interface DropDownItemProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const DropDownMenu = ({
  items,
  toggleVisibility,
}: {
  items: DropDownItemProps[];
  toggleVisibility: () => void;
}) => {
  return (
    <div className='relative z-100'>
      <div className='border-gray-2 absolute top-full right-0 z-100 mt-2 overflow-hidden rounded-md border bg-white shadow-md'>
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
      </div>
    </div>
  );
};

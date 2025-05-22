import { clsx } from 'clsx';
import { ReactNode } from 'react';

export const Tooltip = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={clsx(
        'w-fit rounded-md px-2 py-1',
        'absolute top-0 left-1/2 -mt-1 -translate-x-1/2 -translate-y-full',
        'bg-gray-5',
        'text-label-sm whitespace-nowrap text-white',
      )}
    >
      {children}
    </div>
  );
};

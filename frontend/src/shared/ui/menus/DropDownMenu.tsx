import { ReactNode } from 'react';

export const DropDownMenu = ({ children }: { children: ReactNode }) => {
  return (
    <div className='relative z-100'>
      <div className='absolute top-full right-0 z-100 mt-2 rounded-md bg-white shadow-md'>
        {children}
      </div>
    </div>
  );
};

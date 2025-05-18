import { signOut } from '@/entities/user';

import { useUserStore } from '@/shared/lib';

import { clsx } from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router';

const MenuItem = ({
  children,
  onClick,
  to,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
}) => {
  const style = clsx(
    'z-[99999]',
    'text-label-md cursor-pointer px-2 py-4 text-left',
    'text-gray-5',
    'hover:bg-gray-2 hover:text-black',
  );

  if (to) {
    return (
      <NavLink className={style} onClick={onClick} to={to}>
        {children}
      </NavLink>
    );
  }

  if (onClick) {
    return (
      <button className={style} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <button className={style} onClick={onClick}>
      {children}
    </button>
  );
};

export const ProfileMenu = ({
  setIsProfileMenuHovered,
  anchorRef,
}: {
  setIsProfileMenuHovered: (isProfileMenuHovered: boolean) => void;
  anchorRef: React.RefObject<HTMLDivElement | null> | null;
}) => {
  const { user } = useUserStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (anchorRef?.current && menuRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();

      let left = anchorRect.left + window.scrollX;
      // 메뉴가 화면 오른쪽을 넘으면 right로 붙임
      if (left + menuRect.width > window.innerWidth) {
        left = anchorRect.right - menuRect.width + window.scrollX;
        if (left < 0) left = 0; // 혹시나 화면 왼쪽도 넘으면 0으로
      }

      setCoords({
        top: anchorRect.bottom + window.scrollY,
        left,
      });
    }
  }, [anchorRef?.current, menuRef.current]);

  const menu = (
    <div
      ref={menuRef}
      onMouseEnter={() => setIsProfileMenuHovered(true)}
      onMouseLeave={() => setIsProfileMenuHovered(false)}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        zIndex: 99999,
      }}
    >
      <div className='border-gray-2 bg-background-secondary flex w-48 flex-col rounded-lg border shadow-lg'>
        <div className='border-gray-2 bg-background-primary flex items-center gap-3 border-b p-4'>
          <div className='bg-gray-2 flex size-10 shrink-0 items-center justify-center rounded-full'>
            <img
              src={user?.profileImageUrl ?? '/images/default-profile.png'}
              alt='profile'
              className='h-10 w-10 rounded-full object-cover'
            />
          </div>
          <div>
            <div className='font-bold'>{user?.nickname}</div>
            <div className='text-gray-5 text-sm'>{user?.email}</div>
          </div>
        </div>

        <div className='text-label-md flex flex-col'>
          <MenuItem to='/profile'>프로필</MenuItem>
          <MenuItem
            onClick={() => {
              signOut();
            }}
          >
            로그아웃
          </MenuItem>
        </div>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
};

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

export const Tag = ({
  ref,
  name,
  errorMessage,
  children,
  className,
  onClick,
}: {
  ref?: React.RefObject<HTMLSpanElement>;
  name: string;
  errorMessage?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (showErrorMessage && errorMessage) {
      setFadeOut(false);

      const fadeOutTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2500);

      const hideErrorMessageTimer = setTimeout(() => {
        setShowErrorMessage(false);
        setFadeOut(false);
      }, 3000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideErrorMessageTimer);
      };
    }
  }, [errorMessage, showErrorMessage]);

  return (
    <span>
      <span
        ref={ref}
        className={clsx(
          className,
          'bg-gray-2 relative inline-flex items-center gap-2 rounded-sm px-2 py-1 text-xs font-semibold',
          {
            'cursor-pointer': !errorMessage && onClick,
            'cursor-default': errorMessage || !onClick,
          },
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (errorMessage) {
            setShowErrorMessage(true);
          } else {
            onClick?.();
          }
        }}
      >
        {children}

        {isHovered && !showErrorMessage && (
          <div className='bg-gray-5 absolute -top-full left-1/2 -mt-2 inline-block w-max max-w-[120px] -translate-x-1/2 rounded-md px-2 py-1 text-xs break-words whitespace-pre-line text-white'>
            {name}
          </div>
        )}

        {showErrorMessage && (
          <div
            className={clsx(
              'bg-gray-5 absolute -top-full left-1/2 z-100 inline-block w-max max-w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs break-words whitespace-pre-line text-white transition-opacity duration-500',
              fadeOut ? 'opacity-0' : 'opacity-100',
            )}
          >
            {errorMessage}
          </div>
        )}
      </span>
    </span>
  );
};

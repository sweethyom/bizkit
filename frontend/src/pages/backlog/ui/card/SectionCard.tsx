import { DropDownSection, IconButton } from '@/shared/ui';

import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

interface SectionCardProps {
  cardType: 'epic' | 'sprint';
  cardId: number;
  header: ReactNode;
  children: ReactNode;
  expanded?: boolean;
  toggleExpanded: () => void;
  moreActions: {
    children: ReactNode;
    onClick: () => void;
  }[];
}

export const SectionCard = ({
  cardType,
  header,
  children,
  expanded = false,
  toggleExpanded,
  moreActions,
}: SectionCardProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useLayoutEffect(() => {
    if (expanded && contentRef.current) {
      setMaxHeight(contentRef.current.scrollHeight + 'px');
    } else {
      setMaxHeight('0px');
    }
  }, [expanded, children]);

  return (
    <div
      className={clsx('border-gray-3 flex flex-col rounded-md border border-l-6 shadow-sm', {
        'border-l-point': cardType === 'epic',
        'border-l-primary': cardType === 'sprint',
      })}
    >
      <div
        className={clsx(
          'flex cursor-pointer items-center gap-4 bg-white p-4',
          expanded && 'border-gray-2 border-b',
        )}
        onClick={toggleExpanded}
      >
        <ChevronRight
          className={clsx(
            'transition-transform',
            {
              'text-point': cardType === 'epic',
              'text-primary': cardType === 'sprint',
            },
            expanded ? 'rotate-90' : 'rotate-0',
          )}
        />

        {header}

        <DropDownSection
          items={moreActions}
          button={(toggleVisibility) => (
            <IconButton
              icon='ellipsis'
              onClick={() => {
                toggleVisibility();
              }}
            />
          )}
        />
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight,
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
        }}
      >
        <div className='flex flex-col gap-4 p-4'>{children}</div>
      </div>
    </div>
  );
};

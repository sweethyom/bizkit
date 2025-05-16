import { cn } from '@/shared/lib';
import { DynamicIcon } from 'lucide-react/dynamic';
import { MouseEvent } from 'react';

interface IconButtonProps {
  icon: string;
  onClick: () => void;
  size?: number;
  className?: string;
  color?: string;
  variant?: string;
  disabled?: boolean;
}

export const IconButton = ({
  icon,
  onClick,
  size = 24,
  className,
  color,
  variant,
}: IconButtonProps) => {
  return (
    <button
      type='button'
      className={cn(
        'hover:bg-gray-2/40 text-gray-4 cursor-pointer rounded-full p-2',
        className,
        color && `text-${color}`,
        variant && `bg-${variant}`,
      )}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <DynamicIcon name={icon as any} size={size} />
    </button>
  );
};

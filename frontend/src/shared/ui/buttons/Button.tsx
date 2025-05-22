import { clsx } from 'clsx';
import { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'dotted';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  color?: 'primary' | 'warning' | 'point';
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  size = 'md',
  variant = 'solid',
  color = 'primary',
  className,
  ...props
}: ButtonProps) => {
  const colors = {
    primary: {
      solid: [
        'bg-primary',
        'text-white',
        'border border-primary',
        'hover:border-primary/80 hover:bg-primary/80',
      ],
      outline: [
        'text-primary',
        'border border-primary',
        'hover:border-primary/60 hover:text-primary/60',
      ],
      dotted: [
        'text-black',
        'border border-dashed border-gray-3',
        'hover:border-primary hover:text-primary',
      ],
    },
    warning: {
      solid: [
        'bg-warning',
        'text-white',
        'border border-warning',
        'hover:border-warning/60 hover:bg-warning/60',
      ],
      outline: [
        'text-warning',
        'border border-warning',
        'hover:border-warning/60 hover:text-warning/60',
      ],
    },
    point: {
      solid: [
        'bg-point',
        'text-white',
        'border border-point',
        'hover:border-point/60 hover:bg-point/60',
      ],
      outline: ['text-point', 'border border-point', 'hover:border-point/60 hover:text-point/60'],
    },
  };

  return (
    <button
      className={clsx(
        className,
        ...colors[color][variant as keyof (typeof colors)[typeof color]],
        'text-label-md flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border',
        'disabled:bg-gray-3 disabled:border-gray-3 disabled:cursor-not-allowed disabled:text-white',

        {
          'h-[50px]': size === 'lg',
          'h-[40px]': size === 'md',
          'h-[30px]': size === 'sm',
          'h-[24px]': size === 'xs',
          'px-[15px]': ['lg', 'md', 'sm'].includes(size),
          'px-[8px]': ['xs'].includes(size),
        },
      )}
      {...props}
    />
  );
};

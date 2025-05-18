import { cn } from '@/shared/lib';
import { clsx } from 'clsx';
import { InputHTMLAttributes, RefObject, useState } from 'react';

interface UnderlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: RefObject<HTMLInputElement | null>;
  classNames?: string;
  label?: string;
}

export const UnderlineInput = ({ label, classNames, ref, ...props }: UnderlineInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn('border-gray-3 relative flex w-full items-center border-b transition-colors', {
        'pb-2': Boolean(label),
        'border-gray-4': isFocused,
      })}
    >
      {label && (
        <label
          htmlFor='underline-input'
          className={clsx(
            'text-gray-4 absolute left-0 pb-2 transition-all',
            !isFocused
              ? 'text-label-md top-[20px] self-end'
              : 'text-label-sm text-primary -top-0 self-start',
          )}
        >
          {label}
        </label>
      )}

      <input
        id='underline-input'
        ref={ref}
        type='text'
        className={cn(classNames, 'text-label-md w-full border-none outline-none', {
          'mt-[20px]': Boolean(label),
        })}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </div>
  );
};

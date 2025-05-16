import { cn } from '@/shared/lib';
import { InputHTMLAttributes, useEffect, useRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export const Input = ({ errorMessage, ...props }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setCustomValidity(errorMessage || '');
    }
  }, [errorMessage]);

  return (
    <input
      ref={inputRef}
      className={cn(
        'border-gray-2 w-full rounded-md border-[1px] px-2 py-1.5 shadow-sm',
        'focus:border-primary focus:outline-primary focus:outline',
        'focus:invalid:border-warning focus:invalid:outline-warning',
        'invalid:border-warning',
        'disabled:border-gray-3 disabled:text-gray-3 disabled:placeholder:text-gray-3 disabled:cursor-not-allowed disabled:shadow-none disabled:outline-none',
        props.className,
      )}
      {...props}
    />
  );
};

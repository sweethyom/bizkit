import { Button, Input } from '@/shared/ui';
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

interface SignUpInputProps {
  label?: string;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputChildren?: ReactNode;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: 'primary' | 'warning' | 'point' | undefined;
  };
  errorMessage?: string;
}

export const SignUpInput = ({
  label,
  inputProps,
  inputChildren,
  buttonProps,
  errorMessage,
}: SignUpInputProps) => {
  return (
    <div className='flex flex-col gap-2'>
      {label && (
        <label htmlFor='email' className='text-gray-4 text-label-md'>
          {label}
        </label>
      )}

      <div className='flex w-full items-center justify-between gap-2'>
        <div className='relative w-full'>
          <Input {...inputProps} />
          {inputChildren}
        </div>

        {buttonProps && <Button type='button' color={buttonProps.color} {...buttonProps} />}
      </div>

      {errorMessage && <p className='text-warning text-sm'>{errorMessage}</p>}
    </div>
  );
};

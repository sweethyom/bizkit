// signin/ui/SignInForm.tsx
import { SignInCredentials } from '@/pages/signin/model/types';
import { AlertCircle, LoaderCircle, Lock, Mail } from 'lucide-react';
import { FC, FormEvent } from 'react';

interface SignInFormProps {
  onSubmit: (credentials: SignInCredentials) => void;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  error: string | null;
}

const SignInForm: FC<SignInFormProps> = ({
  onSubmit,
  username,
  setUsername,
  password,
  setPassword,
  isLoading,
  error,
}) => {
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const credentials: SignInCredentials = { username, password };
    onSubmit(credentials);
  };

  return (
    <form className='space-y-6' onSubmit={handleFormSubmit}>
      {/* 이메일 필드 */}
      <div>
        <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
          이메일
        </label>
        <div className='relative mt-1 rounded-md shadow-sm'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <Mail className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='username'
            name='username'
            type='email'
            autoComplete='email'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm'
            placeholder='you@example.com'
          />
        </div>
      </div>

      {/* 비밀번호 필드 */}
      <div>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          비밀번호
        </label>
        <div className='relative mt-1 rounded-md shadow-sm'>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <Lock className='h-5 w-5 text-gray-400' />
          </div>
          <input
            id='password'
            name='password'
            type='password'
            autoComplete='current-password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 pl-10 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm'
            placeholder='••••••••'
          />
        </div>
      </div>

      {/* 로그인 상태 유지 & 비밀번호 찾기 */}
      <div className='flex items-center justify-between'>
        <div className='text-sm'>
          <a
            href='/reset-password'
            className='font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500'
          >
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className='rounded border-l-4 border-red-500 bg-red-50 p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <AlertCircle className='h-5 w-5 text-red-500' />
            </div>
            <div className='ml-3'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 로그인 버튼 */}
      <div>
        <button
          type='submit'
          disabled={isLoading}
          className={`flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
            isLoading ? 'cursor-not-allowed opacity-70' : ''
          }`}
        >
          {isLoading ? (
            <div className='flex items-center'>
              <LoaderCircle className='mr-2 -ml-1 h-4 w-4 animate-spin text-white' />
              로그인 중...
            </div>
          ) : (
            '로그인'
          )}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;

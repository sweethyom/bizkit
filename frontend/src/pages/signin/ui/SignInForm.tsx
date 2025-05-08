// signin/ui/SignInForm.tsx
import { SignInCredentials } from '@/pages/signin/model/types';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { FC, FormEvent } from 'react';

interface SignInFormProps {
  onSubmit: (credentials: SignInCredentials) => void;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (rememberMe: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

const SignInForm: FC<SignInFormProps> = ({
  onSubmit,
  username,
  setUsername,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
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
        <div className='mt-1 relative rounded-md shadow-sm'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
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
            className='pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            placeholder='you@example.com'
          />
        </div>
      </div>

      {/* 비밀번호 필드 */}
      <div>
        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
          비밀번호
        </label>
        <div className='mt-1 relative rounded-md shadow-sm'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
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
            className='pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            placeholder='••••••••'
          />
        </div>
      </div>

      {/* 로그인 상태 유지 & 비밀번호 찾기 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember-me'
            name='remember-me'
            type='checkbox'
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
          />
          <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
            로그인 상태 유지
          </label>
        </div>

        <div className='text-sm'>
          <a
            href='#'
            className='font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out'
          >
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded'>
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
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
        >
          {isLoading ? (
            <div className='flex items-center'>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
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

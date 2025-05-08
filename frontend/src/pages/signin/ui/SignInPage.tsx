// signin/ui/SignInPage.tsx
import { signInUser } from '@/pages/signin/api/signInApi';
import { SignInCredentials } from '@/pages/signin/model/types';
import SignInForm from '@/pages/signin/ui/SignInForm';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router';

const SignInPage: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async (credentials: SignInCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signInUser(credentials);

      // 로그인 성공 확인
      if (response.result === 'SUCCESS') {
        // 토큰 저장
        localStorage.setItem('tokenType', response.data.tokenType);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // 만료 시간 저장
        const accessTokenExpiry = new Date();
        accessTokenExpiry.setSeconds(
          accessTokenExpiry.getSeconds() + response.data.accessTokenExpiresIn,
        );
        localStorage.setItem('accessTokenExpiry', accessTokenExpiry.toISOString());

        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setSeconds(
          refreshTokenExpiry.getSeconds() + response.data.refreshTokenExpiresIn,
        );
        localStorage.setItem('refreshTokenExpiry', refreshTokenExpiry.toISOString());

        if (rememberMe) {
          // rememberMe가 true인 경우 로컬 스토리지에 사용자 정보 저장
          localStorage.setItem('username', credentials.username);
        } else {
          // rememberMe가 false인 경우 세션 스토리지에 사용자 정보 저장
          sessionStorage.setItem('username', credentials.username);
        }

        // 홈페이지로 리다이렉트
        navigate('/');
      } else {
        // 응답은 성공이지만 result가 SUCCESS가 아닌 경우 (이 경우는 API 스펙 상 없을 수 있음)
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* 로고 영역 */}
      <div className='w-full max-w-md'>
        <div className='text-center mb-10'>
          <h2 className='mt-4 text-3xl font-extrabold text-gray-900 tracking-tight'>로그인</h2>
          <p className='mt-2 text-sm text-gray-600'>
            계정이 없으신가요?{' '}
            <a
              href='/signup'
              className='font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out'
            >
              회원가입
            </a>
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className='bg-white py-8 px-6 shadow-xl rounded-xl'>
          <SignInForm
            onSubmit={handleSignIn}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

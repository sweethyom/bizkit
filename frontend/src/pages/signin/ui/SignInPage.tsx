// signin/ui/SignInPage.tsx
import { signInUser } from '@/pages/signin/api/signInApi';
import { SignInCredentials } from '@/pages/signin/model/types';
import SignInForm from '@/pages/signin/ui/SignInForm';
import { fetchUserProfile } from '@/shared/api';
import { tokenStorage, useUserStore } from '@/shared/lib';
import { tokenResponseToTokenInfo } from '@/shared/lib/authToken';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router';

const SignInPage: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (credentials: SignInCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // 로그인 및 토큰 저장
      const tokenInfo = await signInUser(credentials);

      const newTokenInfo = {
        ...tokenInfo,
        accessTokenExpiresAt: new Date(Date.now() + tokenInfo.accessTokenExpiresIn * 1000),
        refreshTokenExpiresAt: new Date(Date.now() + tokenInfo.refreshTokenExpiresIn * 1000),
        refreshTokenRenewableAt: new Date(
          Date.now() + tokenInfo.refreshTokenRenewAvailableSeconds * 1000,
        ),
      };

      tokenStorage.set(tokenResponseToTokenInfo(newTokenInfo));

      // 사용자 정보 가져오기
      try {
        const userProfile = await fetchUserProfile();

        // useUserStore에 사용자 정보 저장
        const setUser = useUserStore.getState().setUser;
        setUser({
          id: userProfile.id,
          nickname: userProfile.nickname,
          email: userProfile.email,
          profileImageUrl: userProfile.avatarUrl || undefined,
        });

        console.log('사용자 정보가 useUserStore에 저장되었습니다:', userProfile);
      } catch (profileError) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', profileError);
        // 사용자 정보를 가져오는데 실패하더라도 로그인은 성공으로 처리
      }

      // my-works 페이지로 리다이렉트
      navigate('/my-works');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8'>
      {/* 로고 영역 */}
      <div className='w-full max-w-md'>
        <div className='mb-10 text-center'>
          <h2 className='mt-4 text-3xl font-extrabold tracking-tight text-gray-900'>로그인</h2>
          <p className='mt-2 text-sm text-gray-600'>
            계정이 없으신가요?{' '}
            <a
              href='/signup'
              className='font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500'
            >
              회원가입
            </a>
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className='rounded-xl bg-white px-6 py-8 shadow-xl'>
          <SignInForm
            onSubmit={handleSignIn}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

// profile/ui/ProfilePage.tsx
import {
  fetchUserProfile,
  updateNickname,
  updatePassword,
  uploadProfileImage,
} from '@/pages/profile/api/profile';
import { UserProfile } from '@/pages/profile/model/types';
import { useUserStore } from '@/shared/lib';
import axios from 'axios';
import { AlertCircle, Camera, CheckCircle, ChevronLeft, Loader } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export default function ProfilePage() {
  const { setUser } = useUserStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 입력 필드 상태
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 처리 상태
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 에러 메시지
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // 사진 업로드 상태
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // 프로필 정보 로드
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserProfile();
        setProfile(data);
        setEmail(data.email);
        setNickname(data.nickname);
        setAvatarUrl(data.avatarUrl || null);
      } catch (err) {
        console.error(err);
        setGeneralError('프로필을 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // 성공 메시지 자동 제거
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // 닉네임 유효성 검사
  const validateNickname = (value: string): boolean => {
    if (!value.trim()) {
      setNicknameError('닉네임을 입력해주세요');
      return false;
    }
    // API 명세서에 따른 제약조건: 닉네임은 한글, 영어, 숫자 포함 2~6자리
    if (value.trim().length < 2 || value.trim().length > 6) {
      setNicknameError('닉네임은 2~6자리여야 합니다');
      return false;
    }
    // 한글, 영어, 숫자만 허용
    const regex = /^[가-힣a-zA-Z0-9]+$/;
    if (!regex.test(value.trim())) {
      setNicknameError('닉네임은 한글, 영어, 숫자만 포함할 수 있습니다');
      return false;
    }
    setNicknameError(null);
    return true;
  };

  // 비밀번호 유효성 검사
  const validatePassword = (): boolean => {
    if (!oldPassword) {
      setPasswordError('현재 비밀번호를 입력해주세요');
      return false;
    }
    if (!newPassword) {
      setPasswordError('새 비밀번호를 입력해주세요');
      return false;
    }
    // 8~16자리 길이만 검사
    if (newPassword.length < 8 || newPassword.length > 16) {
      setPasswordError('비밀번호는 8~16자리여야 합니다');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  // 닉네임 변경 처리
  const handleUpdateNickname = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateNickname(nickname)) return;

    try {
      setIsUpdatingNickname(true);
      await updateNickname(nickname);
      if (profile) {
        setProfile({ ...profile, nickname });
      }
      setSuccessMessage('닉네임이 성공적으로 변경되었습니다');
    } catch (err: any) {
      console.error(err);
      setNicknameError(err.message || '닉네임 변경에 실패했습니다');
    } finally {
      setIsUpdatingNickname(false);
    }
  };

  // 비밀번호 변경 처리
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setIsUpdatingPassword(true);
      await updatePassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다');
    } catch (err: any) {
      console.error(err);
      setPasswordError(err.message || '비밀번호 변경에 실패했습니다');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // 프로필 이미지 변경 처리
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUpdatingAvatar(true);
      setGeneralError(null);

      // 파일 미리보기 URL 생성 (로컬 미리보기용)
      const reader = new FileReader();
      reader.onload = () => {
        // 임시 미리보기 이미지 설정
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 서버에 이미지 업로드
      // API 명세에 따르면 이미지 URL을 바로 반환하지 않고 처리 결과만 리턴
      // uploadProfileImage 함수는 내부적으로 사용자 정보를 다시 조회하여 URL을 반환
      const imageUrl = await uploadProfileImage(file);

      // 성공적으로 업로드 후 받아온 URL 설정
      setAvatarUrl(imageUrl);

      const user = await fetchUserProfile();
      setUser(user);

      // 프로필 상태 업데이트
      if (profile) {
        setProfile({ ...profile, avatarUrl: imageUrl });
      }
      setSuccessMessage('프로필 이미지가 변경되었습니다');
    } catch (err: any) {
      console.error('Profile image upload error:', err);

      // 서버 오류 응답에서 오류 정보 추출
      let errorMessage = '이미지 업로드에 실패했습니다';

      if (err.message) {
        errorMessage = err.message;
      } else if (axios.isAxiosError(err) && err.response?.data?.error) {
        // Axios 오류의 경우 서버 응답에서 오류 메시지 추출
        const serverError = err.response.data.error;
        if (typeof serverError === 'object' && serverError.message) {
          errorMessage = serverError.message;
        } else if (typeof serverError === 'string') {
          errorMessage = serverError;
        }
      }

      setGeneralError(errorMessage);

      // 에러 발생 시 기존 아바타로 되돌림
      setAvatarUrl(profile?.avatarUrl || null);
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <Loader className='h-10 w-10 animate-spin text-gray-500' />
        <p className='mt-4 text-gray-600'>프로필 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-xl p-5'>
      {/* 헤더 */}
      <div className='mb-6 flex items-center'>
        <button
          className='mr-4 rounded-full p-2 hover:bg-gray-100'
          onClick={() => window.history.back()}
        >
          <ChevronLeft className='h-5 w-5' />
        </button>
        <h1 className='text-2xl font-bold'>나의 프로필</h1>
      </div>

      {/* 성공/오류 메시지 */}
      {successMessage && (
        <div className='mb-4 flex items-center rounded-md border border-green-200 bg-green-50 p-3 text-green-700'>
          <CheckCircle className='mr-2 h-5 w-5' />
          {successMessage}
        </div>
      )}

      {generalError && (
        <div className='mb-4 flex items-center rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>
          <AlertCircle className='mr-2 h-5 w-5' />
          {generalError}
        </div>
      )}

      <div className='rounded-lg bg-white p-6 shadow-sm'>
        {/* 프로필 이미지 */}
        <div className='mb-8 flex flex-col items-center'>
          <div className='relative'>
            <div className='flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-200'>
              <img
                src={avatarUrl || profile?.avatarUrl || '/images/default-profile.png'}
                alt='Profile'
                className='h-full w-full object-cover'
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 이미지로 대체
                  e.currentTarget.src = '/images/default-profile.png';
                }}
              />
            </div>
            <label
              htmlFor='avatar-upload'
              className='absolute right-0 bottom-0 cursor-pointer rounded-full bg-gray-800 p-1.5 text-white shadow-md hover:bg-gray-700'
            >
              <Camera className='h-4 w-4' />
            </label>
            <input
              id='avatar-upload'
              type='file'
              className='hidden'
              accept='image/*'
              onChange={handleAvatarChange}
              disabled={isUpdatingAvatar}
            />
          </div>
          {isUpdatingAvatar && <p className='mt-2 text-sm text-gray-500'>이미지 업로드 중...</p>}
        </div>

        {/* 이메일 */}
        <div className='mb-6'>
          <label className='mb-1 block text-sm font-medium text-gray-700' htmlFor='email'>
            이메일
          </label>
          <input
            type='email'
            id='email'
            className='w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
            value={email}
            readOnly
            disabled
          />
          <p className='mt-1 text-xs text-gray-500'>이메일은 변경할 수 없습니다</p>
        </div>

        {/* 닉네임 */}
        <form onSubmit={handleUpdateNickname} className='mb-6'>
          <label className='mb-1 block text-sm font-medium text-gray-700' htmlFor='nickname'>
            닉네임
          </label>
          <div className='flex'>
            <input
              type='text'
              id='nickname'
              className={`flex-1 rounded-md border p-2.5 focus:border-blue-500 focus:ring-blue-500 ${
                nicknameError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isUpdatingNickname}
              placeholder='2~6자리 닉네임 입력'
              maxLength={6}
            />
            <button
              type='submit'
              className='ml-2 rounded-md bg-gray-800 px-4 py-2.5 font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              disabled={isUpdatingNickname || nickname === profile?.nickname}
            >
              {isUpdatingNickname ? <Loader className='h-5 w-5 animate-spin' /> : '변경'}
            </button>
          </div>
          {nicknameError && <p className='mt-1 text-xs text-red-600'>{nicknameError}</p>}
        </form>

        {/* 비밀번호 변경 */}
        <form onSubmit={handleUpdatePassword} className='mb-6'>
          <div className='mb-4'>
            <h3 className='mb-3 text-lg font-medium text-gray-900'>비밀번호 변경</h3>

            <div className='mb-3'>
              <label className='mb-1 block text-sm font-medium text-gray-700' htmlFor='oldPassword'>
                현재 비밀번호
              </label>
              <input
                type='password'
                id='oldPassword'
                className={`w-full rounded-md border p-2.5 focus:border-blue-500 focus:ring-blue-500 ${
                  passwordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={isUpdatingPassword}
              />
            </div>

            <div className='mb-3'>
              <label className='mb-1 block text-sm font-medium text-gray-700' htmlFor='newPassword'>
                새 비밀번호
              </label>
              <input
                type='password'
                id='newPassword'
                className={`w-full rounded-md border p-2.5 focus:border-blue-500 focus:ring-blue-500 ${
                  passwordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isUpdatingPassword}
                placeholder='8~16자리 비밀번호 입력'
                maxLength={16}
              />
            </div>

            <div className='mb-3'>
              <label
                className='mb-1 block text-sm font-medium text-gray-700'
                htmlFor='confirmPassword'
              >
                비밀번호 확인
              </label>
              <input
                type='password'
                id='confirmPassword'
                className={`w-full rounded-md border p-2.5 focus:border-blue-500 focus:ring-blue-500 ${
                  passwordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isUpdatingPassword}
                maxLength={16}
              />
            </div>

            {passwordError && <p className='mt-1 text-xs text-red-600'>{passwordError}</p>}
          </div>

          <button
            type='submit'
            className='w-full rounded-md bg-gray-800 px-4 py-2.5 font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isUpdatingPassword || !oldPassword || !newPassword || !confirmPassword}
          >
            {isUpdatingPassword ? (
              <div className='flex items-center justify-center'>
                <Loader className='mr-2 h-5 w-5 animate-spin' />
                <span>변경 중...</span>
              </div>
            ) : (
              '비밀번호 변경'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

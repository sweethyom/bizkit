// profile/ui/ProfileSettings.tsx
import { useState } from 'react';
import { Save, Upload, KeyRound } from 'lucide-react';
import { clsx } from 'clsx';
import { updateUserProfile, changePassword } from '@/pages/profile/api/profile';
import { UserProfile } from '@/pages/profile/model/types';

interface ProfileSettingsProps {
  userId: string;
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '김개발',
    email: 'dev.kim@example.com',
    role: '프론트엔드 개발자',
    department: '개발팀',
    position: '주니어 개발자',
    bio: '사용자 경험을 향상시키는 프론트엔드 개발자입니다.',
  });
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'TailwindCSS', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 비밀번호 변경 관련 상태
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // 스킬도 포함하여 업데이트
      await updateUserProfile(userId, {
        ...formData,
        skills,
      });
      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');

      // 성공 메시지를 3초 후에 제거
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('프로필 업데이트 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 정규식 검사 (영어 대소문자, 숫자, 특수문자 포함 8~16자리)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=~])[A-Za-z\d!@#$%^&*()_+\-=~]{8,16}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setPasswordError(
        '비밀번호는 영어 대소문자, 숫자, 특수문자(!@#$%^&*()_+-=~) 포함 8~16자리여야 합니다.',
      );
      return;
    }

    setIsChangingPassword(true);
    setPasswordMessage('');
    setPasswordError('');

    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordMessage('비밀번호가 성공적으로 변경되었습니다.');

      // 입력 필드 초기화
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // 성공 메시지를 3초 후에 제거
      setTimeout(() => {
        setPasswordMessage('');
      }, 3000);
    } catch (error) {
      setPasswordError('비밀번호 변경 중 오류가 발생했습니다. 현재 비밀번호를 확인해주세요.');
      console.error(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto'>
      <h2 className='text-xl font-semibold text-gray-900 mb-6'>프로필 설정</h2>

      {successMessage && (
        <div className='mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md'>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className='mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md'>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <section className='bg-white p-6 rounded-lg border border-gray-200 space-y-4'>
          <h3 className='text-lg font-medium text-gray-900 pb-2 border-b border-gray-200'>
            기본 정보
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                이름
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name || ''}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                이메일
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email || ''}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required
                readOnly
              />
              <p className='text-xs text-gray-500 mt-1'>이메일은 변경할 수 없습니다.</p>
            </div>

            <div>
              <label htmlFor='role' className='block text-sm font-medium text-gray-700 mb-1'>
                역할
              </label>
              <input
                type='text'
                id='role'
                name='role'
                value={formData.role || ''}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label htmlFor='department' className='block text-sm font-medium text-gray-700 mb-1'>
                부서
              </label>
              <input
                type='text'
                id='department'
                name='department'
                value={formData.department || ''}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label htmlFor='position' className='block text-sm font-medium text-gray-700 mb-1'>
                직책
              </label>
              <input
                type='text'
                id='position'
                name='position'
                value={formData.position || ''}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div className='md:col-span-2'>
              <label htmlFor='bio' className='block text-sm font-medium text-gray-700 mb-1'>
                자기소개
              </label>
              <textarea
                id='bio'
                name='bio'
                value={formData.bio || ''}
                onChange={handleChange}
                rows={4}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>
        </section>

        <section className='bg-white p-6 rounded-lg border border-gray-200 space-y-4'>
          <h3 className='text-lg font-medium text-gray-900 pb-2 border-b border-gray-200'>
            비밀번호 변경
          </h3>

          {passwordMessage && (
            <div className='mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md'>
              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md'>
              {passwordError}
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label htmlFor='oldPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                현재 비밀번호
              </label>
              <input
                type='password'
                id='oldPassword'
                name='oldPassword'
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                새 비밀번호
              </label>
              <input
                type='password'
                id='newPassword'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
              <p className='text-xs text-gray-500 mt-1'>
                비밀번호는 영어 대소문자, 숫자, 특수문자(!@#$%^&*()_+-=~) 포함 8~16자리여야 합니다.
              </p>
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                새 비밀번호 확인
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div className='flex justify-end'>
              <button
                type='button'
                onClick={handlePasswordSubmit}
                disabled={isChangingPassword}
                className={clsx(
                  'inline-flex items-center px-4 py-2 rounded-md text-white font-medium',
                  isChangingPassword
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700',
                )}
              >
                {isChangingPassword ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
                    변경 중...
                  </>
                ) : (
                  <>
                    <KeyRound size={16} className='mr-2' />
                    비밀번호 변경
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className='bg-white p-6 rounded-lg border border-gray-200 space-y-4'>
          <h3 className='text-lg font-medium text-gray-900 pb-2 border-b border-gray-200'>
            프로필 이미지
          </h3>

          <div className='flex items-center gap-8'>
            <div className='flex-shrink-0'>
              <div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium'>
                {formData.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            <div className='flex-1'>
              <p className='text-sm text-gray-600 mb-3'>
                프로필 이미지를 업로드하세요. 권장 크기는 400x400 픽셀입니다.
              </p>
              <button
                type='button'
                className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
              >
                <Upload size={16} className='mr-2' />
                이미지 업로드
              </button>
            </div>
          </div>
        </section>

        <section className='bg-white p-6 rounded-lg border border-gray-200 space-y-4'>
          <h3 className='text-lg font-medium text-gray-900 pb-2 border-b border-gray-200'>
            기술 스택
          </h3>

          <div className='space-y-4'>
            <div className='flex flex-wrap gap-2'>
              {skills.map((skill) => (
                <div
                  key={skill}
                  className='inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm'
                >
                  {skill}
                  <button
                    type='button'
                    onClick={() => removeSkill(skill)}
                    className='ml-1 text-blue-500 hover:text-blue-700'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className='flex gap-2'>
              <input
                type='text'
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder='기술 추가'
                className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type='button'
                onClick={addSkill}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                추가
              </button>
            </div>
          </div>
        </section>

        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isSaving}
            className={clsx(
              'inline-flex items-center px-6 py-3 rounded-md text-white font-medium',
              isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700',
            )}
          >
            {isSaving ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
                저장 중...
              </>
            ) : (
              <>
                <Save size={16} className='mr-2' />
                변경사항 저장
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

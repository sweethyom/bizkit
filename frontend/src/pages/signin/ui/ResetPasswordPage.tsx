import { useRef, useState } from 'react';
import { resetPasswordApi } from '../api/resetPasswordApi';

const CODE_EXPIRE_SECONDS = 180;

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'reset' | 'done'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [codeTimer, setCodeTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 시작
  const startTimer = () => {
    setCodeTimer(CODE_EXPIRE_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCodeTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 인증코드 요청
  const handleRequestCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await resetPasswordApi.requestEmailVerificationCode(email);
      if (res.result === 'SUCCESS' && res.data?.id) {
        setVerificationId(res.data.id);
        setStep('verify');
        setSuccess('인증코드가 이메일로 전송되었습니다.');
        setVerificationCode('');
        startTimer();
      } else {
        setError('인증코드 요청에 실패했습니다.');
      }
    } catch (e: any) {
      setError(e.message || '인증코드 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 확인
  const handleVerifyCode = async () => {
    if (!verificationId) {
      setError('인증코드 요청을 먼저 해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await resetPasswordApi.verifyEmailVerificationCode(
        verificationId,
        verificationCode,
      );
      if (res.result === 'SUCCESS') {
        setStep('reset');
        setSuccess('이메일 인증이 완료되었습니다.');
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setError('인증코드가 올바르지 않습니다.');
      }
    } catch (e: any) {
      setError(e.message || '인증코드 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 변경
  const handleResetPassword = async () => {
    if (!verificationId) {
      setError('이메일 인증을 먼저 완료해주세요.');
      return;
    }
    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await resetPasswordApi.resetPassword(email, newPassword, verificationId);
      if (res.result === 'SUCCESS') {
        setStep('done');
        setSuccess('비밀번호가 성공적으로 변경되었습니다.');
      } else {
        setError('비밀번호 변경에 실패했습니다.');
      }
    } catch (e: any) {
      setError(e.message || '비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 타이머 포맷
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md'>
        <div className='mb-10 text-center'>
          <h2 className='mt-4 text-3xl font-extrabold tracking-tight text-gray-900'>
            비밀번호 초기화
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            가입하신 이메일로 인증 후 비밀번호를 재설정하세요.
          </p>
        </div>
        <div className='rounded-xl bg-white px-6 py-8 shadow-xl'>
          {error && (
            <div className='mb-4 rounded border-l-4 border-red-500 bg-red-50 p-4'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}
          {success && (
            <div className='mb-4 rounded border-l-4 border-green-500 bg-green-50 p-4'>
              <p className='text-sm text-green-700'>{success}</p>
            </div>
          )}
          {step === 'email' && (
            <form
              className='space-y-6'
              onSubmit={(e) => {
                e.preventDefault();
                handleRequestCode();
              }}
            >
              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  이메일
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm'
                  placeholder='you@example.com'
                  disabled={isLoading || codeTimer > 0}
                />
              </div>
              <button
                type='submit'
                disabled={isLoading || !email || codeTimer > 0}
                className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none'
              >
                {isLoading
                  ? '전송 중...'
                  : codeTimer > 0
                    ? `재요청 (${formatSeconds(codeTimer)})`
                    : '인증코드 요청'}
              </button>
            </form>
          )}
          {step === 'verify' && (
            <form
              className='space-y-6'
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyCode();
              }}
            >
              <div>
                <label
                  htmlFor='verificationCode'
                  className='block text-sm font-medium text-gray-700'
                >
                  인증코드
                </label>
                <input
                  id='verificationCode'
                  name='verificationCode'
                  type='text'
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm'
                  placeholder='이메일로 받은 인증코드 입력'
                  disabled={isLoading}
                />
                {codeTimer > 0 && (
                  <div className='mt-2 text-xs text-gray-500'>
                    인증코드 유효시간: {formatSeconds(codeTimer)}
                  </div>
                )}
                {codeTimer === 0 && (
                  <div className='mt-2 text-xs text-red-500'>
                    인증코드가 만료되었습니다. 다시 요청해주세요.
                  </div>
                )}
              </div>
              <button
                type='submit'
                disabled={isLoading || !verificationCode || codeTimer === 0}
                className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none'
              >
                {isLoading ? '확인 중...' : '인증코드 확인'}
              </button>
            </form>
          )}
          {step === 'reset' && (
            <form
              className='space-y-6'
              onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
            >
              <div>
                <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700'>
                  새 비밀번호
                </label>
                <input
                  id='newPassword'
                  name='newPassword'
                  type='password'
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm'
                  placeholder='새 비밀번호 입력 (8자 이상)'
                  disabled={isLoading}
                />
              </div>
              <button
                type='submit'
                disabled={isLoading || !newPassword || newPassword.length < 8}
                className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none'
              >
                {isLoading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          )}
          {step === 'done' && (
            <div className='text-center'>
              <p className='mb-4 text-lg font-semibold text-gray-700'>
                비밀번호가 성공적으로 변경되었습니다.
              </p>
              <a
                href='/signin'
                className='font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500'
              >
                로그인하러 가기
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

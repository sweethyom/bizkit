import { signUpApi } from '@/pages/signup/api/signUp';
import { useCountdown } from '@/shared/lib';

import { ChangeEvent, useState } from 'react';

interface UseEmailVerificationCodeFieldProps {
  onTimerFinish: () => void;
}

export const useEmailVerificationCodeField = ({
  onTimerFinish,
}: UseEmailVerificationCodeFieldProps) => {
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [emailVerificationCodeError, setEmailVerificationCodeError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const verificationCodeTimer = useCountdown({
    duration: 180,
    onFinish: onTimerFinish,
  });

  const handleEmailVerificationCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailVerificationCode(e.target.value);
  };

  const validateEmailVerificationCode = (emailVerificationCode: string) => {
    if (emailVerificationCode.length === 0) {
      setEmailVerificationCodeError('이메일 인증 코드를 입력해주세요.');
      return false;
    } else {
      setEmailVerificationCodeError('');
      return true;
    }
  };

  const verifyEmailVerificationCode = async (verificationId: string) => {
    if (!validateEmailVerificationCode(emailVerificationCode)) return;

    const response = await signUpApi.verifyEmailVerificationCode(
      verificationId,
      emailVerificationCode,
    );

    if (response.result === 'SUCCESS') {
      alert('이메일 인증이 완료되었습니다.');
      setEmailVerificationCodeError('');
      setIsVerified(true);
      verificationCodeTimer.reset();
    } else {
      setEmailVerificationCodeError(response.data || '');
      setIsVerified(false);
    }
  };

  return {
    emailVerificationCode,
    emailVerificationCodeError,
    isVerified,
    handleEmailVerificationCodeChange,
    validateEmailVerificationCode,
    verifyEmailVerificationCode,
    startVerificationCodeTimer: verificationCodeTimer.start,
    remainingSeconds: verificationCodeTimer.seconds,
    formattedRemainingSeconds: verificationCodeTimer.formattedSeconds(),
  };
};

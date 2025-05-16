import { signUpApi } from '@/pages/signup/api/signUp';

import { ChangeEvent, useState } from 'react';

export const useEmailField = () => {
  const emailPatternString = '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}';

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailVerificationCodeSent, setIsEmailVerificationCodeSent] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setEmail(value);
    validateEmail(value);
  };

  const validateEmail = (email: string) => {
    const emailRegex = new RegExp(emailPatternString);

    if (emailRegex.test(email) || email.length === 0) {
      setEmailError('');
      return true;
    } else {
      setEmailError('이메일 형식이 올바르지 않습니다.');
      return false;
    }
  };

  const sendEmailVerificationCode = async () => {
    if (!validateEmail(email) || emailError) return;

    const response = await signUpApi.requestEmailVerificationCode(email);

    if (response.result === 'SUCCESS') {
      setIsEmailVerificationCodeSent(true);
    } else {
      setEmailError(response.data?.id || '');
      setIsEmailVerificationCodeSent(false);
    }

    return response;
  };

  return {
    emailPatternString,
    email,
    emailError,
    isEmailVerificationCodeSent,
    handleEmailChange,
    validateEmail,
    sendEmailVerificationCode,
    setIsEmailVerificationCodeSent,
  };
};

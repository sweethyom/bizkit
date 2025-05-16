import { ChangeEvent, useState } from 'react';

export const usePasswordCheckField = () => {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckError, setPasswordCheckError] = useState('');
  const [isPasswordCheckVisible, setIsPasswordCheckVisible] = useState(false);

  const handlePasswordCheckChange = (e: ChangeEvent<HTMLInputElement>, password: string) => {
    const value = e.target.value;
    setPasswordCheck(value);

    if (value.length > 0) {
      validatePasswordCheck(value, password);
    }
  };

  const validatePasswordCheck = (passwordCheck: string, password: string) => {
    if (passwordCheck.length === 0 || password.length === 0) {
      setPasswordCheckError('');
      return;
    }

    if (passwordCheck !== password) {
      setPasswordCheckError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordCheckError('');
    }
  };

  const togglePasswordCheckVisibility = () => {
    setIsPasswordCheckVisible(!isPasswordCheckVisible);
  };

  return {
    passwordCheck,
    passwordCheckError,
    handlePasswordCheckChange,
    validatePasswordCheck,
    isPasswordCheckVisible,
    togglePasswordCheckVisibility,
  };
};

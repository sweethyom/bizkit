import { ChangeEvent, useState } from 'react';

export const usePasswordField = () => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (password.length > 16) return;

    const value = e.target.value;
    setPassword(value);

    if (value.length > 0) {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordError('비밀번호는 8자 이상 입력해주세요.');
    } else {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return {
    password,
    passwordError,
    handlePasswordChange,
    validatePassword,
    isPasswordVisible,
    togglePasswordVisibility,
  };
};

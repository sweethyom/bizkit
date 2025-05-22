import { signUpApi } from '@/pages/signup/api/signUp';

import { ChangeEvent, useState } from 'react';

export const useProfileNameField = () => {
  const [profileName, setProfileName] = useState('');
  const [profileNameError, setProfileNameError] = useState('');
  const [isProfileNameChecked, setIsProfileNameChecked] = useState(false);

  const handleProfileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 6) {
      setProfileNameError('최대 6자까지 입력할 수 있습니다.');
      return;
    } else {
      setProfileNameError('');
    }

    setProfileName(value.trim());
  };

  const checkProfileName = async () => {
    if (profileName.length === 0) {
      setProfileNameError('닉네임을 입력해주세요.');
      return;
    }

    const response = await signUpApi.validateProfileName(profileName);

    console.log(response);

    // 테스트용
    // const response = { result: 'SUCCESS' };
    // const response = { result: 'SUCCESS', data: { isUnique: false } };

    if (response.data?.isUnique) {
      setProfileNameError('');
      setIsProfileNameChecked(true);
    } else {
      setProfileNameError('이미 사용중인 닉네임입니다.');
      setIsProfileNameChecked(true);
    }
  };

  return {
    profileName,
    profileNameError,
    isProfileNameChecked,
    handleProfileNameChange,
    checkProfileName,
  };
};

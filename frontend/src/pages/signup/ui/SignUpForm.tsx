import { signUpApi } from '@/pages/signup/api/signUp';
import { useEmailField } from '@/pages/signup/model/useEmailField';
import { useEmailVerificationCodeField } from '@/pages/signup/model/useEmailVerificationCodeField';
import { usePasswordCheckField } from '@/pages/signup/model/usePasswordCheckField';
import { usePasswordField } from '@/pages/signup/model/usePasswordField';
import { useProfileNameField } from '@/pages/signup/model/useProfileNameField';
import { SignUpInput } from '@/pages/signup/ui/SignUpInput';

import { api, ApiResponse } from '@/shared/api';
import { UserInfo, useUserStore } from '@/shared/lib';
import { TokenInfo } from '@/shared/model';
import { Button, IconButton } from '@/shared/ui';

import { Check } from 'lucide-react';
import { FormEvent, useState } from 'react';

export const SignUpForm = () => {
  const userStore = useUserStore();
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const emailField = useEmailField();
  const emailVerificationCodeField = useEmailVerificationCodeField({
    onTimerFinish: () => {
      emailField.setIsEmailVerificationCodeSent(false);
    },
  });

  const passwordField = usePasswordField();
  const passwordCheckField = usePasswordCheckField();

  const profileNameField = useProfileNameField();

  const showEmailVerificationCodeField =
    (emailVerificationCodeField.remainingSeconds === 0 || emailField.isEmailVerificationCodeSent) &&
    !emailVerificationCodeField.isVerified;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await signUpApi.signUp(
      emailField.email,
      profileNameField.profileName,
      passwordField.password,
      verificationId || '',
    );

    if (response?.result === 'SUCCESS') {
      // const signInResponse = await userApi.signIn(emailField.email, passwordField.password);
      const signInResponse = await api.post<ApiResponse<TokenInfo>>('/auth/signin', {
        email: emailField.email,
        password: passwordField.password,
      });

      if (signInResponse?.data?.result === 'SUCCESS') {
        const userResponse = await api.get<ApiResponse<UserInfo>>('/users/me');
        if (userResponse?.data?.result === 'SUCCESS' && userResponse.data?.data) {
          userStore.setUser(userResponse.data.data);
        }
      }
    }
  };

  return (
    <form className='flex w-full flex-col gap-4' onSubmit={handleSubmit}>
      <SignUpInput
        label='이메일'
        inputProps={{
          id: 'email',
          inputMode: 'email',
          autoComplete: 'email',
          pattern: emailField.emailPatternString,
          placeholder: '아이디로 사용할 이메일을 입력해주세요',
          disabled:
            emailField.isEmailVerificationCodeSent &&
            emailVerificationCodeField.remainingSeconds > 120,
          value: emailField.email,
          onChange: emailField.handleEmailChange,
        }}
        errorMessage={emailField.emailError}
        buttonProps={{
          type: 'button',
          disabled:
            (Boolean(emailField.emailError) ||
              emailField.email.length === 0 ||
              emailField.isEmailVerificationCodeSent) &&
            emailVerificationCodeField.remainingSeconds > 120,
          children: emailVerificationCodeField.remainingSeconds > 120 ? '인증코드 전송' : '재전송',
          onClick: async () => {
            const response = await emailField.sendEmailVerificationCode();

            if (response?.result === 'SUCCESS') {
              emailVerificationCodeField.startVerificationCodeTimer();
              setVerificationId(response.data?.id || '');
            }
          },
        }}
      />

      {showEmailVerificationCodeField && (
        <div className='flex flex-col gap-2'>
          <SignUpInput
            inputProps={{
              type: 'text',
              placeholder: '이메일 인증코드를 입력해주세요',
              value: emailVerificationCodeField.emailVerificationCode,
              onChange: emailVerificationCodeField.handleEmailVerificationCodeChange,
            }}
            errorMessage={emailVerificationCodeField.emailVerificationCodeError}
            inputChildren={
              <div className='text-gray-4 text-label-md absolute top-1/2 right-0 -translate-y-1/2 p-2'>
                {emailVerificationCodeField.formattedRemainingSeconds}
              </div>
            }
          />

          <Button
            type='button'
            onClick={() => {
              if (verificationId) {
                emailVerificationCodeField.verifyEmailVerificationCode(verificationId);
              }
            }}
            disabled={
              Boolean(emailVerificationCodeField.emailVerificationCodeError) ||
              emailVerificationCodeField.emailVerificationCode.length === 0 ||
              emailVerificationCodeField.isVerified ||
              emailVerificationCodeField.remainingSeconds <= 0
            }
          >
            인증
          </Button>
        </div>
      )}

      <SignUpInput
        label='비밀번호'
        inputProps={{
          type: passwordField.isPasswordVisible ? 'text' : 'password',
          placeholder: '비밀번호를 입력해주세요',
          value: passwordField.password,
          onChange: (e) => {
            passwordField.handlePasswordChange(e);
            passwordCheckField.validatePasswordCheck(
              passwordCheckField.passwordCheck,
              e.target.value,
            );
          },
          autoComplete: 'new-password',
        }}
        errorMessage={passwordField.passwordError}
        inputChildren={
          <IconButton
            className='absolute top-1/2 right-0 -translate-y-1/2'
            icon='eye'
            onClick={passwordField.togglePasswordVisibility}
            size={20}
          />
        }
      />

      <SignUpInput
        label='비밀번호 확인'
        inputProps={{
          type: passwordCheckField.isPasswordCheckVisible ? 'text' : 'password',
          placeholder: '비밀번호를 다시 입력해주세요',
          value: passwordCheckField.passwordCheck,
          onChange: (e) => {
            passwordCheckField.handlePasswordCheckChange(e, passwordField.password);
            passwordCheckField.validatePasswordCheck(e.target.value, passwordField.password);
          },
          autoComplete: 'new-password',
        }}
        errorMessage={passwordCheckField.passwordCheckError}
        inputChildren={
          <IconButton
            className='absolute top-1/2 right-0 -translate-y-1/2'
            icon='eye'
            onClick={passwordCheckField.togglePasswordCheckVisibility}
            size={20}
          />
        }
      />

      <div className='flex flex-col gap-2'>
        <SignUpInput
          label='닉네임'
          inputProps={{
            placeholder: '닉네임을 입력해주세요 (최대 6자)',
            value: profileNameField.profileName,
            onChange: profileNameField.handleProfileNameChange,
          }}
          errorMessage={profileNameField.profileNameError}
          buttonProps={{
            type: 'button',
            disabled:
              Boolean(profileNameField.profileNameError) ||
              profileNameField.profileName.length === 0,
            children: '중복확인',
            onClick: () => {
              profileNameField.checkProfileName();
            },
          }}
        />

        {profileNameField.isProfileNameChecked &&
          profileNameField.profileNameError.length === 0 && (
            <p className='text-success text-label-md flex items-center gap-1'>
              <Check size={16} />
              사용 가능한 닉네임입니다.
            </p>
          )}
      </div>

      <Button
        type='submit'
        disabled={
          !emailField.isEmailVerificationCodeSent ||
          !emailVerificationCodeField.isVerified ||
          Boolean(emailField.emailError) ||
          emailField.email.length === 0 ||
          Boolean(passwordField.passwordError) ||
          passwordField.password.length === 0 ||
          Boolean(passwordCheckField.passwordCheckError) ||
          passwordCheckField.passwordCheck.length === 0 ||
          Boolean(profileNameField.profileNameError) ||
          profileNameField.profileName.length === 0 ||
          !profileNameField.isProfileNameChecked
        }
      >
        회원가입
      </Button>
    </form>
  );
};

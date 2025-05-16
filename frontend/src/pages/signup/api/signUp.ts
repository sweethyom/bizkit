import { api, ApiResponse } from '@/shared/api';
import { tokenStorage } from '@/shared/lib';

type ValidateProfileNameResponse = {
  isUnique: boolean;
};

type SignUpResponse = {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  refreshTokenRenewAvailableSeconds: number;
};

export const signUpApi = {
  async requestEmailVerificationCode(email: string) {
    const response = await api.post<ApiResponse<{ id: string }>>('/verification/request', {
      email: email,
      purpose: 'SIGN_UP',
    });
    return response.data;
  },

  async verifyEmailVerificationCode(id: string, code: string) {
    const response = await api.post<ApiResponse>('/verification/verify', {
      id: id,
      code: code,
    });
    console.log(response.data);
    return response.data;
  },

  async validateProfileName(profileName: string) {
    const response = await api.get<ApiResponse<ValidateProfileNameResponse>>(
      `/users/nickname/is-unique?nickname=${profileName}`,
    );
    return response.data;
  },

  async signUp(email: string, profileName: string, password: string, verificationCodeId: string) {
    const response = await api.post<ApiResponse<SignUpResponse>>('/users', {
      email: email,
      password: password,
      nickname: profileName,
      verificationCodeId: verificationCodeId,
    });

    console.log(response.data);

    if (response.data?.result === 'SUCCESS' && response.data.data) {
      tokenStorage.set(response.data.data);
    }

    return response.data;
  },
};

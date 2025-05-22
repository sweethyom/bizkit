import { api, ApiResponse } from '@/shared/api';

export const resetPasswordApi = {
  async requestEmailVerificationCode(email: string) {
    const response = await api.post<ApiResponse<{ id: string }>>('/verification/request', {
      email: email,
      purpose: 'RESET_PASSWORD',
    });
    return response.data;
  },

  async verifyEmailVerificationCode(id: string, code: string) {
    const response = await api.post<ApiResponse>('/verification/verify', {
      id: id,
      code: code,
    });
    return response.data;
  },

  async resetPassword(email: string, newPassword: string, verificationCodeId: string) {
    const response = await api.patch<ApiResponse>('/users/password/reset', {
      email: email,
      password: newPassword,
      verificationCodeId: verificationCodeId,
    });
    return response.data;
  },
};

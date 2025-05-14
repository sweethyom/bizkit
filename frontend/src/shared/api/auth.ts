import { TokenInfo } from '@/shared/model/types';
import { api } from './instance';
import { ApiResponse } from './types';

export const authApi = {
  reissueToken: (refreshToken: string) => {
    return api.post<ApiResponse<TokenInfo>>('/auth/token/reissue', {
      refreshToken,
    });
  },

  renewToken: (refreshToken: string) => {
    return api.post<ApiResponse<TokenInfo>>('/auth/token/renew', {
      refreshToken,
    });
  },
};

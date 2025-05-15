import { TokenInfo } from '@/shared/model/types';
import axios from 'axios';
import { ApiResponse } from './types';

const authInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  reissueToken: (refreshToken: string) => {
    return authInstance.post<ApiResponse<TokenInfo>>('/auth/token/reissue', {
      refreshToken,
    });
  },

  renewToken: (refreshToken: string) => {
    return authInstance.post<ApiResponse<TokenInfo>>('/auth/token/renew', {
      refreshToken,
    });
  },
};

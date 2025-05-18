import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from './types';

const authInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ReissueData = {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
};

export type TokenData = {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  refreshTokenRenewAvailableSeconds: number;
};

export const authApi = {
  reissueToken: (refreshToken: string): Promise<AxiosResponse<ApiResponse<ReissueData>>> => {
    return authInstance.post<ApiResponse<ReissueData>>('/auth/token/reissue', { refreshToken });
  },
  renewToken: (refreshToken: string): Promise<AxiosResponse<ApiResponse<TokenData>>> => {
    return authInstance.post<ApiResponse<TokenData>>('/auth/token/renew', { refreshToken });
  },
};

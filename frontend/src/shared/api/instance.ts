import { tokenStorage } from '@/shared/lib/tokenStorage';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { reissueResponseToTokenInfo, tokenResponseToTokenInfo } from '../lib/authToken';
import { useUserStore } from '../lib/useUserStore';
import { TokenInfo } from '../model/types';
import { authApi } from './auth';
const BASE_URL = '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRenewingRefreshToken = false;
let refreshTokenPromise: Promise<TokenInfo | null> | null = null;

const logout = () => {
  // tokenStorage.remove();
  // useUserStore.getState().clearUser();
  // window.location.href = '/signin';
};

// 요청 인터셉터
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.url?.includes('/auth/')) {
      // 인증 API 호출은 인터셉트하지 않음
      return config;
    }

    let currentTokenInfo = tokenStorage.get();
    if (!currentTokenInfo) return config;

    const now = Date.now();

    if (currentTokenInfo.refreshTokenRenewableAt < now) {
      if (currentTokenInfo.refreshTokenExpiresAt < now) {
        logout();
        tokenStorage.remove();
        useUserStore.getState().clearUser();

        return Promise.reject(
          new AxiosError(
            'Refresh Token이 만료되었습니다. 다시 로그인 해주세요.',
            'ERR_REFRESH_TOKEN_EXPIRED',
            config,
          ),
        );
      }

      if (!isRenewingRefreshToken) {
        isRenewingRefreshToken = true;
        refreshTokenPromise = authApi
          .renewToken(`${currentTokenInfo.tokenType} ${currentTokenInfo.refreshToken}`)
          .then((response) => {
            if (!response.data.data) {
              throw new Error('No data in renew response');
            }

            const newFullTokenInfo = tokenResponseToTokenInfo(response.data.data);
            tokenStorage.set(newFullTokenInfo);
            return newFullTokenInfo;
          })
          .catch((error) => {
            console.error('Request Interceptor: Failed to renew refresh token.', error);
            tokenStorage.remove();
            useUserStore.getState().clearUser();
            throw error;
          })
          .finally(() => {
            isRenewingRefreshToken = false;
            // refreshTokenPromise = null; // 다음 갱신 사이클을 위해 null로 설정 고려
          });
      }

      try {
        const renewedTokenInfo = await refreshTokenPromise;
        if (renewedTokenInfo) {
          currentTokenInfo = renewedTokenInfo;
        } else {
          // 이 경우는 refreshTokenPromise가 null을 반환하도록 로직이 짜여있지 않으므로,
          // 보통 에러가 throw되어 아래 catch 블록으로 갔어야 함.
          // 방어적으로 로직 추가.
          return Promise.reject(
            new AxiosError(
              'Refresh Token 갱신 과정에서 토큰을 얻지 못했습니다.',
              'ERR_REFRESH_TOKEN_UNEXPECTED_NULL',
              config,
            ),
          );
        }
      } catch (error) {
        // refreshTokenPromise가 reject된 경우 (네트워크 오류, 갱신 API 실패 등)
        // performLogout은 이미 호출되었을 것임.
        return Promise.reject(error);
      }
    }

    // 2. 액세스 토큰 첨부
    if (currentTokenInfo.accessToken) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${currentTokenInfo.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isReissuingAccessToken = false;
let accessTokenReissueSubscribers: Array<(newAccessToken: string | null) => void> = [];

const addAccessTokenReissueSubscriber = (callback: (newAccessToken: string | null) => void) => {
  accessTokenReissueSubscribers.push(callback);
};

const onAccessTokenReissuedSuccessfully = (newAccessToken: string) => {
  accessTokenReissueSubscribers.forEach((callback) => callback(newAccessToken));
  accessTokenReissueSubscribers = [];
};

const onAccessTokenReissueFailed = () => {
  accessTokenReissueSubscribers.forEach((callback) => callback(null));
  accessTokenReissueSubscribers = [];
  logout();
};

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      if (originalRequest._retry || originalRequest.url?.includes('/auth/token/reissue')) {
        console.error(
          'Response Interceptor: Token reissue failed (already retried or self-reissue error). Logging out.',
        );
        if (!originalRequest.url?.includes('/auth/token/reissue')) {
          logout();
        }
        return Promise.reject(error);
      }

      const currentTokenInfo = tokenStorage.get();
      if (!currentTokenInfo?.refreshToken || currentTokenInfo.refreshTokenExpiresAt < Date.now()) {
        console.error(
          'Response Interceptor: No valid refresh token for reissue or RT expired. Logging out.',
        );
        logout();
        return Promise.reject(error);
      }

      if (!isReissuingAccessToken) {
        isReissuingAccessToken = true;
        authApi
          .reissueToken(`Bearer ${currentTokenInfo.refreshToken}`)
          .then((response) => {
            if (!response.data.data) {
              throw new Error('No data in reissue response');
            }

            const newAccessTokenInfo = reissueResponseToTokenInfo(
              response.data.data,
              currentTokenInfo,
            );
            tokenStorage.set(newAccessTokenInfo);
            onAccessTokenReissuedSuccessfully(newAccessTokenInfo.accessToken);
          })
          .catch((reissueError) => {
            console.error('Response Interceptor: Access token reissue failed.', reissueError);
            onAccessTokenReissueFailed();
          })
          .finally(() => {
            isReissuingAccessToken = false;
          });
      }

      return new Promise((resolve, reject) => {
        addAccessTokenReissueSubscriber((newAccessToken: string | null) => {
          if (newAccessToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `${tokenStorage.get()?.tokenType || 'Bearer'} ${newAccessToken}`;
            originalRequest._retry = true;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    return Promise.reject(error);
  },
);

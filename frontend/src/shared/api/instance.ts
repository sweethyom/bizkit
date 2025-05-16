import { tokenStorage } from '@/shared/lib/tokenStorage';
import { useUserStore } from '@/shared/lib/useUserStore';
import axios from 'axios';
import { authApi } from './auth';

const BASE_URL = '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const tokenInfo = tokenStorage.get();
    if (tokenInfo) {
      config.headers.Authorization = `${tokenInfo.tokenType} ${tokenInfo.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === '/api/auth/reissue') {
      return Promise.reject(error);
    }

    // 토큰 만료 에러 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokenInfo = tokenStorage.get();
        const refreshToken = tokenInfo?.refreshToken;

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Refresh 토큰 갱신 시도
        try {
          const renewResponse = await authApi.renewToken(refreshToken);
          if (renewResponse.status === 200) {
            const newTokenInfo = renewResponse.data.data;
            if (!newTokenInfo) {
              throw new Error('No new token info');
            }
            tokenStorage.set(newTokenInfo);

            originalRequest.headers.Authorization = `${newTokenInfo.tokenType} ${newTokenInfo.accessToken}`;
            return api(originalRequest);
          }
        } catch (renewError) {
          // 갱신 실패 시 재발급 시도
          try {
            const reissueResponse = await authApi.reissueToken(refreshToken);
            if (reissueResponse.status === 200) {
              const newAccessTokenInfo = reissueResponse.data.data;
              const newTokenInfo = {
                ...tokenInfo,
                ...newAccessTokenInfo,
              };
              tokenStorage.set(newTokenInfo);

              originalRequest.headers.Authorization = `${newTokenInfo.tokenType} ${newTokenInfo.accessToken}`;
              return api(originalRequest);
            }
          } catch (reissueError) {
            // 재발급도 실패한 경우 로그아웃 처리
            tokenStorage.remove();
            useUserStore.getState().clearUser();
            // window.location.href = '/signin';
            return Promise.reject(reissueError);
          }
          return Promise.reject(renewError);
        }
      } catch (error) {
        // 리프레시 토큰이 없는 경우 로그아웃 처리
        tokenStorage.remove();
        useUserStore.getState().clearUser();
        // window.location.href = '/signin';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

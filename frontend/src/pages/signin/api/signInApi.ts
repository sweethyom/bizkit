// signin/api/signInApi.ts
import { SignInCredentials, SignInResponse } from '../model/types';

// API 연동 준비용 더미 함수
// 실제 API 연동 시 아래 함수를 구현하면 됩니다
export const signInUser = async (credentials: SignInCredentials): Promise<SignInResponse> => {
  // 실제 API 호출 코드로 대체해야 합니다
  // 예: const response = await fetch('/api/signin', { method: 'POST', body: JSON.stringify(credentials) });
  
  // 현재는 더미 응답을 반환
  return new Promise((resolve) => {
    // API 호출 시뮬레이션을 위한 타임아웃
    setTimeout(() => {
      // 유효한 로그인인 경우 (개발 중 테스트용)
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        resolve({
          accessToken: 'dummy-access-token',
          refreshToken: 'dummy-refresh-token',
          user: {
            id: 'user123',
            email: credentials.email,
            name: '테스트 사용자'
          }
        });
      } else {
        // 로그인 실패 시
        throw new Error('Invalid email or password');
      }
    }, 1000); // 1초 지연
  });
};

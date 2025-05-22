// signin/api/signInApi.ts
import { SignInCredentials, SignInResponse } from '@/pages/signin/model/types';

// axios 인스턴스 가져오기
import { api, ApiResponse } from '@/shared/api';
import axios from 'axios';

// axios 인스턴스가 준비되지 않은 경우에 대한 임시 모킹 함수
export const signInUser = async (credentials: SignInCredentials): Promise<SignInResponse> => {
  try {
    // 실제 API 호출
    const response = await api.post<ApiResponse<SignInResponse>>('/auth/login', credentials);
    console.log(response);

    return response.data.data as SignInResponse;

    // 개발 테스트를 위해 모킹 함수는 주석 처리하고 유지
    // return await mockSignInRequest(credentials);
  } catch (error) {
    // axios 에러 처리
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.message || '로그인에 실패했습니다.';
      throw new Error(serverError);
    }

    throw error; // 다른 종류의 에러는 그대로 전파
  }
};

// 모킹 함수 (axios 인스턴스가 준비되기 전까지 사용)
// const mockSignInRequest = (credentials: SignInCredentials): Promise<SignInResponse> => {
//   return new Promise((resolve, reject) => {
//     // API 호출 시뮬레이션을 위한 타임아웃
//     setTimeout(() => {
//       // 유효한 로그인인 경우 (개발 중 테스트용)
//       if (credentials.username === 'qq@qq.qq' && credentials.password === 'qqqqqq') {
//         resolve({
//           result: 'SUCCESS',
//           data: {
//             tokenType: 'Bearer',
//             accessToken: 'access.token.example',
//             accessTokenExpiresIn: 3600,
//             refreshToken: 'refresh.token.example',
//             refreshTokenExpiresIn: 36000,
//             refreshTokenRenewAvailableSeconds: 3600,
//           },
//         });
//       } else {
//         // 로그인 실패 시
//         reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.'));
//       }
//     }, 1000); // 1초 지연
//   });
// };

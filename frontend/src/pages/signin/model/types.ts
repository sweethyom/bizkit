// signin/model/types.ts

export interface SignInCredentials {
  username: string; // 이메일 형식
  password: string;
}

// 로그인 응답형은 TokenInfo와 동일함
export type SignInResponse = {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  refreshTokenRenewAvailableSeconds: number;
};

// signin/model/types.ts
export interface SignInCredentials {
  username: string; // 이메일 형식
  password: string;
}

export interface SignInResponse {
  result: string;
  data: {
    tokenType: string;
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
    refreshTokenRenewAvailableSeconds: number;
  }
}

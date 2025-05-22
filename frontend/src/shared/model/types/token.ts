export type TokenInfo = {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  refreshTokenRenewableAt: number;
};

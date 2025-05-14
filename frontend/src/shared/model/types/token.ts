export type TokenInfo = {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  refreshTokenRenewAvailableSeconds: number;
};

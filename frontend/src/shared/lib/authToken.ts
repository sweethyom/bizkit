import { ReissueData, TokenData } from '../api/auth';
import { TokenInfo } from '../model/types';

const MS_PER_SECOND = 1000;

export const tokenResponseToTokenInfo = (data: TokenData): TokenInfo => {
  const now = Date.now();

  const accessTokenExpiresAt = now + data.accessTokenExpiresIn * MS_PER_SECOND;
  const refreshTokenExpiresAt = now + data.refreshTokenExpiresIn * MS_PER_SECOND;
  const refreshTokenRenewableAt =
    refreshTokenExpiresAt - data.refreshTokenRenewAvailableSeconds * MS_PER_SECOND;

  return {
    tokenType: data.tokenType,
    accessToken: data.accessToken,
    accessTokenExpiresAt,
    refreshToken: data.refreshToken,
    refreshTokenExpiresAt,
    refreshTokenRenewableAt,
  };
};

export const reissueResponseToTokenInfo = (data: ReissueData, tokenInfo: TokenInfo): TokenInfo => {
  const now = Date.now();

  return {
    ...tokenInfo,
    tokenType: data.tokenType || tokenInfo.tokenType,
    accessToken: data.accessToken || tokenInfo.accessToken,
    accessTokenExpiresAt:
      now + (data.accessTokenExpiresIn || tokenInfo.accessTokenExpiresAt) * MS_PER_SECOND,
  };
};

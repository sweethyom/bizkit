package com.ssafy.taskit.security;

import com.fasterxml.jackson.annotation.JsonInclude;

public record TokenResponse(
    String tokenType,
    @JsonInclude(JsonInclude.Include.NON_NULL) String accessToken,
    @JsonInclude(JsonInclude.Include.NON_NULL) Long accessTokenExpiresIn,
    @JsonInclude(JsonInclude.Include.NON_NULL) String refreshToken,
    @JsonInclude(JsonInclude.Include.NON_NULL) Long refreshTokenExpiresIn,
    @JsonInclude(JsonInclude.Include.NON_NULL) Long refreshTokenRenewAvailableSeconds) {
  public TokenResponse {
    tokenType = JwtConst.TOKEN_TYPE;
  }

  public static TokenResponse reissue(String accessToken, Long accessTokenExpiresIn) {
    return new TokenResponse(null, accessToken, accessTokenExpiresIn, null, null, null);
  }

  public static TokenResponse create(
      String accessToken,
      Long accessTokenExpiresIn,
      String refreshToken,
      Long refreshTokenExpiresIn,
      Long refreshTokenRenewAvailableSeconds) {
    return new TokenResponse(
        null,
        accessToken,
        accessTokenExpiresIn,
        refreshToken,
        refreshTokenExpiresIn,
        refreshTokenRenewAvailableSeconds);
  }
}

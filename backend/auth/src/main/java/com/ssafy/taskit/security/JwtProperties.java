package com.ssafy.taskit.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtProperties {

  @Value("${taskit.jwt.properties.secret}")
  private String secret;

  @Value("${taskit.jwt.properties.access-token.expiration-seconds}")
  private Long accessTokenExpirationSeconds;

  @Value("${taskit.jwt.properties.refresh-token.expiration-seconds}")
  private Long refreshTokenExpirationSeconds;

  @Value("${taskit.jwt.properties.refresh-token.renew-available-seconds}")
  private Long refreshTokenRenewAvailableSeconds;

  public String getSecret() {
    return secret;
  }

  public Long getAccessTokenExpirationSeconds() {
    return accessTokenExpirationSeconds;
  }

  public Long getRefreshTokenExpirationSeconds() {
    return refreshTokenExpirationSeconds;
  }

  public Long getRefreshTokenRenewAvailableSeconds() {
    return refreshTokenRenewAvailableSeconds;
  }
}

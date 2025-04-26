package com.ssafy.taskit.security;

import static java.util.concurrent.TimeUnit.SECONDS;

import com.ssafy.taskit.auth.api.error.AuthCoreApiErrorType;
import com.ssafy.taskit.auth.api.error.AuthCoreApiException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class JwtService {

  private static final String ACCESS_TOKEN_SUBJECT = "access-token";
  private static final String REFRESH_TOKEN_SUBJECT = "refresh-token";

  private static final String USER_ID_CLAIM = "userId";
  private static final String USERNAME_CLAIM = "username";
  private static final String ROLES_CLAIM = "roles";

  private final RefreshTokenRepository refreshTokenRepository;
  private final JwtProperties jwtProperties;

  public JwtService(RefreshTokenRepository refreshTokenRepository, JwtProperties jwtProperties) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.jwtProperties = jwtProperties;
  }

  public AuthUserDetails resolveAccessToken(String accessToken) {
    Claims claims = validateAccessToken(accessToken);

    Long userId = parseUserIdFrom(claims);
    String username = parseUsernameFrom(claims);
    List<String> roles = parseRolesFrom(claims);

    return new AuthUserDetails(userId, username, roles);
  }

  private Claims validateAccessToken(String accessToken) {
    SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
    if (!StringUtils.hasText(accessToken)) {
      throw new AuthCoreApiException(AuthCoreApiErrorType.INVALID_ACCESS_TOKEN);
    }

    try {
      return Jwts.parser()
          .verifyWith(key)
          .build()
          .parseSignedClaims(accessToken)
          .getPayload();
    } catch (JwtException e) {
      throw new AuthCoreApiException(AuthCoreApiErrorType.INVALID_ACCESS_TOKEN);
    }
  }

  @Transactional
  public TokenResponse create(Long userId, String username, List<String> roles) {
    String newAccessToken = createAccessToken(userId, username, roles);
    String newRefreshToken = createRefreshToken(userId, username, roles);

    refreshTokenRepository.upsert(
        username,
        newRefreshToken,
        Duration.ofSeconds(jwtProperties.getRefreshTokenExpirationSeconds()));

    return TokenResponse.create(
        newAccessToken,
        jwtProperties.getAccessTokenExpirationSeconds(),
        newRefreshToken,
        jwtProperties.getRefreshTokenExpirationSeconds(),
        jwtProperties.getRefreshTokenRenewAvailableSeconds());
  }

  @Transactional
  public TokenResponse reissue(String refreshToken) {
    Claims claims = validateRefreshToken(refreshToken);

    Long userId = parseUserIdFrom(claims);
    String email = parseUsernameFrom(claims);
    List<String> roles = parseRolesFrom(claims);

    String newAccessToken = createAccessToken(userId, email, roles);

    return TokenResponse.reissue(newAccessToken, jwtProperties.getAccessTokenExpirationSeconds());
  }

  private List<String> parseRolesFrom(Claims claims) {
    return ((List<?>) claims.get(ROLES_CLAIM)).stream().map(Object::toString).toList();
  }

  private String parseUsernameFrom(Claims claims) {
    return claims.get(USERNAME_CLAIM, String.class);
  }

  private Long parseUserIdFrom(Claims claims) {
    return claims.get(USER_ID_CLAIM, Long.class);
  }

  @Transactional
  public TokenResponse renew(String refreshToken) {
    Claims claims = validateRefreshToken(refreshToken);

    Date expiration = claims.getExpiration();
    long remainingMillis = expiration.getTime() - System.currentTimeMillis();
    if (remainingMillis
        > TimeUnit.SECONDS.toMillis(jwtProperties.getRefreshTokenRenewAvailableSeconds())) {
      throw new AuthCoreApiException(AuthCoreApiErrorType.REFRESH_TOKEN_NOT_RENEWABLE);
    }

    Long userId = parseUserIdFrom(claims);
    String email = parseUsernameFrom(claims);
    List<String> roles = parseRolesFrom(claims);

    String newAccessToken = createAccessToken(userId, email, roles);
    String newRefreshToken = createRefreshToken(userId, email, roles);

    refreshTokenRepository.upsert(
        email,
        newRefreshToken,
        Duration.ofSeconds(jwtProperties.getRefreshTokenExpirationSeconds()));

    return TokenResponse.create(
        newAccessToken,
        jwtProperties.getAccessTokenExpirationSeconds(),
        newRefreshToken,
        jwtProperties.getRefreshTokenExpirationSeconds(),
        jwtProperties.getRefreshTokenRenewAvailableSeconds());
  }

  // 공통 리프레시 토큰 검증 로직
  private Claims validateRefreshToken(String refreshToken) {
    if (!StringUtils.hasText(refreshToken)) {
      throw new AuthCoreApiException(AuthCoreApiErrorType.INVALID_REFRESH_TOKEN);
    }

    SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));

    try {
      Claims claims =
          Jwts.parser().verifyWith(key).build().parseSignedClaims(refreshToken).getPayload();

      String email = parseUsernameFrom(claims);
      String cachedToken = refreshTokenRepository
          .get(email)
          .orElseThrow(() -> new AuthCoreApiException(AuthCoreApiErrorType.INVALID_REFRESH_TOKEN));

      if (!refreshToken.equals(cachedToken)) {
        throw new AuthCoreApiException(AuthCoreApiErrorType.INVALID_REFRESH_TOKEN);
      }

      return claims;

    } catch (JwtException e) {
      throw new AuthCoreApiException(AuthCoreApiErrorType.INVALID_REFRESH_TOKEN);
    }
  }

  private String createAccessToken(Long userId, String email, List<String> roles) {
    return buildToken(
        userId,
        email,
        roles,
        ACCESS_TOKEN_SUBJECT,
        jwtProperties.getAccessTokenExpirationSeconds());
  }

  private String createRefreshToken(Long userId, String email, List<String> roles) {
    return buildToken(
        userId,
        email,
        roles,
        REFRESH_TOKEN_SUBJECT,
        jwtProperties.getRefreshTokenExpirationSeconds());
  }

  private String buildToken(
      Long userId, String email, List<String> roles, String subject, Long expirationSeconds) {
    SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));

    return Jwts.builder()
        .subject(subject)
        .claim(USER_ID_CLAIM, userId)
        .claim(USERNAME_CLAIM, email)
        .claim(ROLES_CLAIM, roles)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + SECONDS.toMillis(expirationSeconds)))
        .signWith(key)
        .compact();
  }
}

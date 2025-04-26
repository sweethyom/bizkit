package com.ssafy.taskit.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.taskit.auth.api.error.AuthCoreApiException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

public class RefreshTokenRenewFilter extends OncePerRequestFilter {

  private static final AntPathRequestMatcher PATH_REQUEST_MATCHER =
      new AntPathRequestMatcher("/auth/token/renew", "POST");

  private final JwtService jwtService;
  private final ObjectMapper objectMapper;

  public RefreshTokenRenewFilter(JwtService jwtService, ObjectMapper objectMapper) {
    this.jwtService = jwtService;
    this.objectMapper = objectMapper;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    if (!PATH_REQUEST_MATCHER.matches(request)) {
      filterChain.doFilter(request, response);
      return;
    }

    String refreshToken = TokenExtractUtils.extractRefreshTokenFromBody(request, objectMapper);

    try {
      TokenResponse tokenResponse = jwtService.renew(refreshToken);
      ResponseUtils.sendResponse(response, tokenResponse, objectMapper);
      return;
    } catch (AuthCoreApiException e) {
      request.setAttribute(JwtConst.JWT_AUTH_EXCEPTION_ATTRIBUTE_KEY, e);
    }

    filterChain.doFilter(request, response);
  }
}

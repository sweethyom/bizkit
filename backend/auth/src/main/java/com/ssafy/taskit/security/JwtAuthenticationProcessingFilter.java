package com.ssafy.taskit.security;

import com.ssafy.taskit.auth.api.error.AuthCoreApiException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationProcessingFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  public JwtAuthenticationProcessingFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  private static UsernamePasswordAuthenticationToken getAuthenticated(
      AuthUserDetails authUserDetails) {
    return UsernamePasswordAuthenticationToken.authenticated(
        authUserDetails.getId(),
        null,
        authUserDetails.getRoles().stream().map(SimpleGrantedAuthority::new).toList());
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String accessToken = TokenExtractUtils.extractAccessTokenFromHeader(request);

    if (!StringUtils.hasText(accessToken)) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      AuthUserDetails authUserDetails = jwtService.resolveAccessToken(accessToken);
      Authentication authentication = getAuthenticated(authUserDetails);
      SecurityContextHolder.getContext().setAuthentication(authentication);

      Long userId = (Long) authentication.getPrincipal();
      request.setAttribute("userId", userId);
    } catch (AuthCoreApiException e) {
      request.setAttribute(JwtConst.JWT_AUTH_EXCEPTION_ATTRIBUTE_KEY, e);
    }

    filterChain.doFilter(request, response);
  }
}

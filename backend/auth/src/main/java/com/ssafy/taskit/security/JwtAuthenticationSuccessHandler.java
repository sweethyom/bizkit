package com.ssafy.taskit.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class JwtAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

  private final JwtService jwtService;
  private final ObjectMapper objectMapper;

  public JwtAuthenticationSuccessHandler(JwtService jwtService, ObjectMapper objectMapper) {
    this.jwtService = jwtService;
    this.objectMapper = objectMapper;
  }

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication)
      throws IOException {
    AuthUserDetails authUserDetails = (AuthUserDetails) authentication.getPrincipal();

    Long id = authUserDetails.getId();
    String username = authUserDetails.getUsername();
    List<String> roles = authUserDetails.getRoles();

    TokenResponse tokenResponse = jwtService.create(id, username, roles);

    ResponseUtils.sendResponse(response, tokenResponse, objectMapper);
  }
}

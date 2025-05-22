package com.ssafy.taskit.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.taskit.auth.api.error.AuthCoreApiErrorType;
import com.ssafy.taskit.auth.api.error.AuthCoreApiException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private final ObjectMapper objectMapper;

  public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException {

    AuthCoreApiException authCoreApiException =
        (AuthCoreApiException) request.getAttribute(JwtConst.JWT_AUTH_EXCEPTION_ATTRIBUTE_KEY);

    if (Objects.nonNull(authCoreApiException)) {
      ResponseUtils.sendUnauthorizedResponse(
          response, authCoreApiException.getErrorType(), objectMapper);
      return;
    }

    ResponseUtils.sendUnauthorizedResponse(
        response, AuthCoreApiErrorType.UNAUTHORIZED, objectMapper);
  }
}

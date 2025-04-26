package com.ssafy.taskit.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.taskit.auth.api.error.AuthCoreApiErrorType;
import com.ssafy.taskit.auth.api.error.AuthErrorMessage;
import com.ssafy.taskit.auth.api.response.AuthApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class ErrorResponseAuthenticationFailureHandler implements AuthenticationFailureHandler {

  private final ObjectMapper objectMapper;

  public ErrorResponseAuthenticationFailureHandler(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @Override
  public void onAuthenticationFailure(
      HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
      throws IOException {
    AuthCoreApiErrorType errorType = AuthCoreApiErrorType.INCORRECT_PASSWORD;
    sendResponse(response, errorType);
  }

  private void sendResponse(HttpServletResponse response, AuthCoreApiErrorType errorType)
      throws IOException {
    String body =
        objectMapper.writeValueAsString(AuthApiResponse.error(new AuthErrorMessage(errorType)));
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
    response.getWriter().write(body);
  }
}

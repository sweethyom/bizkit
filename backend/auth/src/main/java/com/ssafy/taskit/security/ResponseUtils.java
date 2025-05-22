package com.ssafy.taskit.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.taskit.auth.api.error.AuthCoreApiErrorType;
import com.ssafy.taskit.auth.api.error.AuthErrorMessage;
import com.ssafy.taskit.auth.api.response.AuthApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

public class ResponseUtils {

  private ResponseUtils() {}

  public static void sendResponse(
      HttpServletResponse response, TokenResponse tokenResponse, ObjectMapper objectMapper)
      throws IOException {
    String body = objectMapper.writeValueAsString(AuthApiResponse.success(tokenResponse));

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
    response.getWriter().write(body);
    response.setStatus(HttpStatus.OK.value());
  }

  public static void sendUnauthorizedResponse(
      HttpServletResponse response, AuthCoreApiErrorType errorType, ObjectMapper objectMapper)
      throws IOException {
    AuthApiResponse<Void> errorResponse = AuthApiResponse.error(new AuthErrorMessage(errorType));

    String body = objectMapper.writeValueAsString(errorResponse);
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
    response.getWriter().write(body);
  }
}

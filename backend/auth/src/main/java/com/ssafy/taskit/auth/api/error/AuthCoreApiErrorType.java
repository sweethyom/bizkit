package com.ssafy.taskit.auth.api.error;

import org.springframework.http.HttpStatus;

public enum AuthCoreApiErrorType {
  INTERNAL_SERVER_ERROR(
      AuthCoreApiErrorCode.AE1000,
      "서버 오류가 발생하였습니다.",
      AuthCoreApiErrorLevel.ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR),

  UNAUTHORIZED(
      AuthCoreApiErrorCode.AE3000,
      "인증되지 않은 사용자 입니다.",
      AuthCoreApiErrorLevel.WARN,
      HttpStatus.FORBIDDEN),

  INCORRECT_PASSWORD(
      AuthCoreApiErrorCode.AE3001,
      "아이디 또는 비밀번호가 일치하지 않습니다.",
      AuthCoreApiErrorLevel.WARN,
      HttpStatus.FORBIDDEN),

  INVALID_ACCESS_TOKEN(
      AuthCoreApiErrorCode.AE3002,
      "유효하지 않은 access token 입니다.",
      AuthCoreApiErrorLevel.WARN,
      HttpStatus.FORBIDDEN),

  INVALID_REFRESH_TOKEN(
      AuthCoreApiErrorCode.AE3003,
      "유효하지 않은 refresh token 입니다.",
      AuthCoreApiErrorLevel.WARN,
      HttpStatus.FORBIDDEN),

  REFRESH_TOKEN_NOT_RENEWABLE(
      AuthCoreApiErrorCode.AE3004,
      "refresh token 갱신 가능한 시간이 아닙니다.",
      AuthCoreApiErrorLevel.WARN,
      HttpStatus.FORBIDDEN),
  INVALID_FILE(
      AuthCoreApiErrorCode.AE3005,
      "파일이 올바르지 않습니다.",
      AuthCoreApiErrorLevel.WARN,
      HttpStatus.BAD_REQUEST);

  private final AuthCoreApiErrorCode code;
  private final String message;
  private final AuthCoreApiErrorLevel level;
  private final HttpStatus status;

  AuthCoreApiErrorType(
      AuthCoreApiErrorCode code, String message, AuthCoreApiErrorLevel level, HttpStatus status) {
    this.code = code;
    this.message = message;
    this.level = level;
    this.status = status;
  }

  public AuthCoreApiErrorCode getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public AuthCoreApiErrorLevel getLevel() {
    return level;
  }

  public HttpStatus getStatus() {
    return status;
  }
}

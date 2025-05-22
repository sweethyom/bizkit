package com.ssafy.taskit.auth.api.error;

public class AuthCoreApiException extends RuntimeException {
  private final AuthCoreApiErrorType errorType;

  public AuthCoreApiException(AuthCoreApiErrorType errorType) {
    super(errorType.getMessage());
    this.errorType = errorType;
  }

  public AuthCoreApiErrorType getErrorType() {
    return errorType;
  }
}

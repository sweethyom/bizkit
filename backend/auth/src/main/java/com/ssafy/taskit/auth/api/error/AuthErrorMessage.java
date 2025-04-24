package com.ssafy.taskit.auth.api.error;

import com.ssafy.taskit.domain.error.AuthCoreErrorType;

public class AuthErrorMessage {

  private final String code;

  private final String message;

  public AuthErrorMessage(AuthCoreErrorType errorType) {
    this.code = errorType.getCode().name();
    this.message = errorType.getMessage();
  }

  public AuthErrorMessage(AuthCoreApiErrorType errorType) {
    this.code = errorType.getCode().name();
    this.message = errorType.getMessage();
  }

  public AuthErrorMessage(AuthCoreErrorType errorType, String formattedMessage) {
    this.code = errorType.getCode().name();
    this.message = formattedMessage;
  }

  public AuthErrorMessage(AuthCoreApiErrorType errorType, String formattedMessage) {
    this.code = errorType.getCode().name();
    this.message = formattedMessage;
  }

  public String getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }
}

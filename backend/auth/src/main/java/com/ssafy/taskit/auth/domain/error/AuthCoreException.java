package com.ssafy.taskit.auth.domain.error;

import java.text.MessageFormat;

public class AuthCoreException extends RuntimeException {

  private final AuthCoreErrorType errorType;

  public AuthCoreException(AuthCoreErrorType errorType) {
    super(errorType.getMessage());
    this.errorType = errorType;
  }

  public AuthCoreException(AuthCoreErrorType errorType, Object... args) {
    super(MessageFormat.format(errorType.getMessage(), args));
    this.errorType = errorType;
  }

  public AuthCoreErrorType getErrorType() {
    return errorType;
  }
}

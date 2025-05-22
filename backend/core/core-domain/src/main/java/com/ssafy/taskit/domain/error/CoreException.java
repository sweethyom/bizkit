package com.ssafy.taskit.domain.error;

import java.text.MessageFormat;

public class CoreException extends RuntimeException {

  private final CoreErrorType errorType;

  public CoreException(CoreErrorType errorType) {
    super(errorType.getMessage());
    this.errorType = errorType;
  }

  public CoreException(CoreErrorType errorType, Object... args) {
    super(MessageFormat.format(errorType.getMessage(), args));
    this.errorType = errorType;
  }

  public CoreErrorType getErrorType() {
    return errorType;
  }
}

package com.ssafy.taskit.domain.error;

public class CoreException extends RuntimeException {

  private final CoreErrorType errorType;

  public CoreException(CoreErrorType errorType) {
    super(errorType.getMessage());
    this.errorType = errorType;
  }

  public CoreErrorType getErrorType() {
    return errorType;
  }
}

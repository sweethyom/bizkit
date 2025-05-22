package com.ssafy.taskit.api.error;

public class CoreApiException extends RuntimeException {
  private final CoreApiErrorType errorType;

  public CoreApiException(CoreApiErrorType errorType) {
    super(errorType.getMessage());
    this.errorType = errorType;
  }

  public CoreApiErrorType getErrorType() {
    return errorType;
  }
}

package com.ssafy.taskit.api.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.taskit.domain.error.CoreErrorType;

public class ErrorMessage {

  private final String code;

  private final String message;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final Object data;

  public ErrorMessage(CoreErrorType errorType) {
    this.code = errorType.getCode().name();
    this.message = errorType.getMessage();
    this.data = null;
  }

  public ErrorMessage(CoreErrorType errorType, Object data) {
    this.code = errorType.getCode().name();
    this.message = errorType.getMessage();
    this.data = data;
  }

  public ErrorMessage(CoreApiErrorType errorType) {
    this.code = errorType.getCode().name();
    this.message = errorType.getMessage();
    this.data = null;
  }

  public ErrorMessage(CoreApiErrorType errorType, Object data) {
    this.code = errorType.getCode().name();
    this.message = errorType.getMessage();
    this.data = data;
  }

  public ErrorMessage(CoreApiErrorType errorType, String message) {
    this.code = errorType.getCode().name();
    this.message = message;
    this.data = null;
  }

  public String getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public Object getData() {
    return data;
  }
}

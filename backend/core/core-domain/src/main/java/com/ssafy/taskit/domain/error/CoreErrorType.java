package com.ssafy.taskit.domain.error;

public enum CoreErrorType {
  DATA_NOT_FOUND(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.A000, "데이터를 찾을 수 없습니다.", CoreErrorLevel.INFO);

  private final CoreErrorKind kind;
  private final CoreErrorCode code;
  private final String message;
  private final CoreErrorLevel level;

  CoreErrorType(CoreErrorKind kind, CoreErrorCode code, String message, CoreErrorLevel level) {
    this.kind = kind;
    this.code = code;
    this.message = message;
    this.level = level;
  }

  public CoreErrorKind getKind() {
    return kind;
  }

  public CoreErrorCode getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public CoreErrorLevel getLevel() {
    return level;
  }
}

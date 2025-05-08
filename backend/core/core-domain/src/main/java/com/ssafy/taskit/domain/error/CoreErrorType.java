package com.ssafy.taskit.domain.error;

public enum CoreErrorType {
  DATA_NOT_FOUND(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.A000, "데이터를 찾을 수 없습니다.", CoreErrorLevel.INFO),
  NAME_LENGTH_LIMIT_OVER(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.C000,
      "컴포넌트 이름의 길이는 20bytes를 초과할 수 없습니다.",
      CoreErrorLevel.INFO),

  CONTENT_LENGTH_LIMIT_OVER(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.C001,
      "컴포넌트 이름의 길이는 100bytes를 초과할 수 없습니다.",
      CoreErrorLevel.INFO),

  DUPLICATED_COMPONENT_NAME(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.C002, "컴포넌트 이름은 중복 될 수 없습니다.", CoreErrorLevel.INFO),

  EPIC_NOT_FOUND(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.E000, "해당 에픽을 찾을 수 없습니다.", CoreErrorLevel.INFO);
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

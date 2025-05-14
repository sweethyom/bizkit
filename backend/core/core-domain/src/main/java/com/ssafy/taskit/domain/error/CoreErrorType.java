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

  COMPONENT_NOT_FOUND(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.C003, "컴포넌트를 찾을 수 없습니다.", CoreErrorLevel.INFO),

  COMPONENT_NOT_IN_PROJECT(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.C004,
      "해당 컴포넌트는 지정한 프로젝트에 속하지 않습니다.",
      CoreErrorLevel.INFO),

  EPIC_NOT_FOUND(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.E000, "해당 에픽을 찾을 수 없습니다.", CoreErrorLevel.INFO),
  DUPLICATED_PROJECT_KEY(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.P001, "프로젝트 키는 중복될 수 없습니다.", CoreErrorLevel.INFO),
  ISSUE_NOT_FOUND(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.I000, "해당 이슈를 찾을 수 없습니다.", CoreErrorLevel.INFO),
  BIZPOINT_NOT_POSITIVE(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.I001, "비즈포인트는 양수여야 합니다.", CoreErrorLevel.INFO),
  IMPORTANCE_NOT_VALID(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.I002,
      "중요도는 HIGH, LOW 중 하나여야 합니다.",
      CoreErrorLevel.INFO),
  STATUS_NOT_VALID(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.I003,
      "진행 상태는 TODO, IN_PROGRESS, DONE 중 하나여야 합니다.",
      CoreErrorLevel.INFO),
  EPIC_NOT_IN_PROJECT(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.I004,
      "현재 프로젝트에 존재하는 에픽으로만 변경할 수 있습니다.",
      CoreErrorLevel.INFO),
  USER_NOT_FOUND(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.I005, "해당 사용자를 찾을 수 없습니다.", CoreErrorLevel.INFO),
  SPRINT_NOT_FOUND(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.S000, "해당 스프린트를 찾을 수 없습니다.", CoreErrorLevel.INFO),

  SPRINT_DUE_DATE_BEFORE_START(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.S001,
      "예상 종료일은 시작일보다 빠를 수 없습니다.",
      CoreErrorLevel.INFO),

  SPRINT_STATUS_IS_NOT_ONGOING(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.S002,
      "해당 스프린트는 활성화 되지 않은 스프린트입니다.",
      CoreErrorLevel.INFO),

  SPRINT_STATUS_IS_ONGOING(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.S003,
      "해당 스프린트는 활성화된 스프린트입니다.",
      CoreErrorLevel.INFO),

  SPRINT_STATUS_IS_NOT_READY(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.S004,
      "해당 스프린트는 READY 상태가 아닙니다. ",
      CoreErrorLevel.INFO),

  SPRINT_STATUS_IS_NOT_COMPLETED(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.S005,
      "해당 스프린트는 COMPLETED 상태가 아닙니다. ",
      CoreErrorLevel.INFO),

  SPRINT_NOT_IN_SAME_PROJECT(
      CoreErrorKind.CLIENT_ERROR,
      CoreErrorCode.S006,
      "스프린트들이 같은 프로젝트에 속해 있지 않습니다.",
      CoreErrorLevel.INFO),
  SPRINT_IS_EQUAL(
      CoreErrorKind.CLIENT_ERROR, CoreErrorCode.S007, "같은 스프린트입니다.", CoreErrorLevel.INFO);
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

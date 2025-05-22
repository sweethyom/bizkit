package com.ssafy.taskit.api.error;

import org.springframework.http.HttpStatus;

public enum CoreApiErrorType {
  INTERNAL_SERVER_ERROR(
      CoreApiErrorCode.AE1000,
      "서버 오류가 발생하였습니다.",
      CoreApiErrorLevel.ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR),

  METHOD_NOT_ALLOWED(
      CoreApiErrorCode.AE1001,
      "지원하지 않는 HTTP 메서드입니다.",
      CoreApiErrorLevel.INFO,
      HttpStatus.METHOD_NOT_ALLOWED),

  // 지원하지 않는 미디어 타입 (415 Unsupported Media Type)
  UNSUPPORTED_MEDIA_TYPE(
      CoreApiErrorCode.AE1002,
      "지원하지 않는 미디어 타입입니다.",
      CoreApiErrorLevel.INFO,
      HttpStatus.UNSUPPORTED_MEDIA_TYPE),

  // 수락할 수 없는 미디어 타입 (406 Not Acceptable)
  NOT_ACCEPTABLE(
      CoreApiErrorCode.AE1003,
      "수락할 수 없는 미디어 타입입니다.",
      CoreApiErrorLevel.INFO,
      HttpStatus.NOT_ACCEPTABLE),

  // 경로 변수 누락 (400 Bad Request)
  MISSING_PATH_VARIABLE(
      CoreApiErrorCode.AE1004, "경로 변수가 누락되었습니다.", CoreApiErrorLevel.INFO, HttpStatus.BAD_REQUEST),

  // 필수 요청 파라미터 누락 (400 Bad Request)
  MISSING_REQUIRED_PARAMETER(
      CoreApiErrorCode.AE1005,
      "필수 요청 파라미터가 누락되었습니다.",
      CoreApiErrorLevel.INFO,
      HttpStatus.BAD_REQUEST),

  // 파라미터 타입 불일치 (400 Bad Request)
  INVALID_PARAMETER(
      CoreApiErrorCode.AE1006,
      "파라미터 타입이 일치하지 않습니다.",
      CoreApiErrorLevel.INFO,
      HttpStatus.BAD_REQUEST),

  // 요청 본문 형식 오류 (400 Bad Request)
  INVALID_REQUEST_BODY(
      CoreApiErrorCode.AE1007,
      "요청 본문 형식이 잘못되었습니다.",
      CoreApiErrorLevel.INFO,
      HttpStatus.BAD_REQUEST),

  // 핸들러 없음 (404 Not Found)
  NOT_FOUND(
      CoreApiErrorCode.AE1008, "요청한 리소스를 찾을 수 없습니다.", CoreApiErrorLevel.INFO, HttpStatus.NOT_FOUND),

  // 파일 업로드 크기 초과 (413 Payload Too Large)
  PAYLOAD_TOO_LARGE(
      CoreApiErrorCode.AE1010,
      "업로드 파일 크기가 허용된 한도를 초과했습니다.",
      CoreApiErrorLevel.WARN,
      HttpStatus.PAYLOAD_TOO_LARGE),
  REQUIRED_FIELD_MISSING_OR_INVALID(
      CoreApiErrorCode.AE1011,
      "요청 필드가 누락되거나 유효하지 않습니다.",
      CoreApiErrorLevel.WARN,
      HttpStatus.BAD_REQUEST),
  INVALID_FILE(
      CoreApiErrorCode.AE1012, "파일이 올바르지 않습니다.", CoreApiErrorLevel.WARN, HttpStatus.BAD_REQUEST);

  private final CoreApiErrorCode code;
  private final String message;
  private final CoreApiErrorLevel level;
  private final HttpStatus status;

  CoreApiErrorType(
      CoreApiErrorCode code, String message, CoreApiErrorLevel level, HttpStatus status) {
    this.code = code;
    this.message = message;
    this.level = level;
    this.status = status;
  }

  public CoreApiErrorCode getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public CoreApiErrorLevel getLevel() {
    return level;
  }

  public HttpStatus getStatus() {
    return status;
  }
}

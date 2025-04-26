package com.ssafy.taskit.auth.domain.error;

import static com.ssafy.taskit.auth.domain.error.AuthCoreErrorCode.*;
import static com.ssafy.taskit.auth.domain.error.AuthCoreErrorKind.*;
import static com.ssafy.taskit.auth.domain.error.AuthCoreErrorLevel.*;

public enum AuthCoreErrorType {
  USER_NOT_FOUND(CLIENT_ERROR, AUE0000, "사용자를 찾을 수 없습니다.", ERROR),
  INVALID_CREDENTIALS(CLIENT_ERROR, AUE1000, "잘못된 인증 정보입니다.", WARN),
  VERIFICATION_REQUEST_TOO_FREQUENT(CLIENT_ERROR, AUE1001, "인증 코드 요청은 {0}초 후에 다시 시도해주세요.", WARN),
  INVALID_VERIFICATION_CODE(CLIENT_ERROR, AUE1002, "잘못된 인증 코드입니다.", WARN),
  UNVERIFIED_VERIFICATION_CODE(CLIENT_ERROR, AUE1003, "인증 코드 인증이 완료되지 않았습니다.", WARN),
  DUPLICATED_USERNAME(CLIENT_ERROR, AUE1004, "유저네임이 중복되었습니다.", INFO),
  DUPLICATED_NICKNAME(CLIENT_ERROR, AUE1005, "닉네임이 중복되었습니다.", INFO),
  FILE_SIZE_EXCEEDED(CLIENT_ERROR, AUE1006, "파일 최대 사이즈를 {0}MB를 초과하였습니다.", INFO),
  INVALID_IMAGE(CLIENT_ERROR, AUE1006, "업로드 파일이 이미지가 아닙니다.", WARN),
  INCORRECT_MIME_TYPE(CLIENT_ERROR, AUE1007, "MIME 타입과 파일이 일치하지 않습니다.", WARN);

  private final AuthCoreErrorKind kind;
  private final AuthCoreErrorCode code;
  private final String message;
  private final AuthCoreErrorLevel level;

  AuthCoreErrorType(
      AuthCoreErrorKind kind, AuthCoreErrorCode code, String message, AuthCoreErrorLevel level) {
    this.kind = kind;
    this.code = code;
    this.message = message;
    this.level = level;
  }

  public AuthCoreErrorKind getKind() {
    return kind;
  }

  public AuthCoreErrorCode getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public AuthCoreErrorLevel getLevel() {
    return level;
  }
}

package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.error.CoreApiErrorType;
import com.ssafy.taskit.api.response.ApiResponse;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final String EXCEPTION_LOG_FORMAT = "Exception : {}";

  private final Logger log = LoggerFactory.getLogger(getClass());

  @ExceptionHandler(MissingServletRequestPartException.class)
  protected ResponseEntity<ApiResponse<Void>> handleMissingServletRequestPartException(
      MissingServletRequestPartException e) {
    log.error("error={}", e.getMessage(), e);

    String partName = e.getRequestPartName();
    String errorMessage = String.format("%s: Required request part is missing", partName);

    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.REQUIRED_FIELD_MISSING_OR_INVALID, errorMessage),
        HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(HandlerMethodValidationException.class)
  protected ResponseEntity<ApiResponse<Void>> handleHandlerMethodValidationException(
      HandlerMethodValidationException e) {
    log.error("error={}", e.getMessage(), e);

    String errorMessage = e.getParameterValidationResults().stream()
        .flatMap(validationResult -> validationResult.getResolvableErrors().stream())
        .map(error -> {
          String[] codes = error.getCodes();
          String field = codes != null && codes.length > 0 ? extractFieldName(codes[0]) : "unknown";
          return field + ": " + error.getDefaultMessage();
        })
        .collect(Collectors.joining(", "));

    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.REQUIRED_FIELD_MISSING_OR_INVALID, errorMessage),
        HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  protected ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException e) {
    log.error("error={}", e.getMessage(), e);

    BindingResult bindingResult = e.getBindingResult();

    String errorMessage = bindingResult.getFieldErrors().stream()
        .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
        .collect(Collectors.joining(", "));

    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.REQUIRED_FIELD_MISSING_OR_INVALID, errorMessage),
        HttpStatus.BAD_REQUEST);
  }

  private String extractFieldName(String code) {
    if (code.contains(".")) {
      return code.substring(code.lastIndexOf(".") + 1);
    }
    return code;
  }

  // HTTP 요청 방식이 잘못된 경우 (405 Method Not Allowed)
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ApiResponse<Void>> handleHttpRequestMethodNotSupportedException(
      HttpRequestMethodNotSupportedException e) {
    log.error("잘못된 HTTP 메서드 요청: {}", e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.METHOD_NOT_ALLOWED), HttpStatus.METHOD_NOT_ALLOWED);
  }

  // 지원하지 않는 미디어 타입 요청 (415 Unsupported Media Type)
  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  public ResponseEntity<ApiResponse<Void>> handleHttpMediaTypeNotSupportedException(
      HttpMediaTypeNotSupportedException e) {
    log.error("지원하지 않는 미디어 타입: {}", e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.UNSUPPORTED_MEDIA_TYPE),
        HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }

  // 클라이언트가 수락할 수 없는 미디어 타입 요청 (406 Not Acceptable)
  @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
  public ResponseEntity<ApiResponse<Void>> handleHttpMediaTypeNotAcceptableException(
      HttpMediaTypeNotAcceptableException e) {
    log.error("수락 불가 미디어 타입: {}", e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.NOT_ACCEPTABLE), HttpStatus.NOT_ACCEPTABLE);
  }

  // 경로 변수 누락 (400 Bad Request)
  @ExceptionHandler(MissingPathVariableException.class)
  public ResponseEntity<ApiResponse<Void>> handleMissingPathVariableException(
      MissingPathVariableException e) {
    log.error("경로 변수 누락: {}", e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.MISSING_PATH_VARIABLE), HttpStatus.BAD_REQUEST);
  }

  // 필수 요청 파라미터 누락 (400 Bad Request)
  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ApiResponse<Void>> handleMissingServletRequestParameterException(
      MissingServletRequestParameterException e) {
    log.error("필수 파라미터 누락: {}", e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.MISSING_REQUIRED_PARAMETER, e.getParameterName()),
        HttpStatus.BAD_REQUEST);
  }

  // 요청 파라미터 타입 불일치 (400 Bad Request)
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ApiResponse<Void>> handleMethodArgumentTypeMismatchException(
      MethodArgumentTypeMismatchException e) {
    log.error("파라미터 타입 불일치: {}", e.getMessage(), e);
    String errorMessage = e.getName() + ": " + e.getValue();
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.INVALID_PARAMETER, errorMessage),
        HttpStatus.BAD_REQUEST);
  }

  // 요청 본문 형식 오류 (400 Bad Request)
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException(
      HttpMessageNotReadableException e) {
    log.error("요청 본문 형식 오류: {}", e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.INVALID_REQUEST_BODY), HttpStatus.BAD_REQUEST);
  }

  // 요청 URL에 대한 핸들러 없음 (404 Not Found)
  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<ApiResponse<Void>> handleNoHandlerFoundException(
      NoHandlerFoundException e) {
    log.error("핸들러 없음: {}", e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.NOT_FOUND), HttpStatus.NOT_FOUND);
  }

  // 파일 업로드 크기 초과 (413 Payload Too Large)
  @ExceptionHandler(MaxUploadSizeExceededException.class)
  public ResponseEntity<ApiResponse<Void>> handleMaxUploadSizeExceededException(
      MaxUploadSizeExceededException e) {
    log.error("파일 업로드 크기 초과: {}", e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.PAYLOAD_TOO_LARGE), HttpStatus.PAYLOAD_TOO_LARGE);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
    log.error(EXCEPTION_LOG_FORMAT, e.getMessage(), e);
    return new ResponseEntity<>(
        ApiResponse.error(CoreApiErrorType.INTERNAL_SERVER_ERROR),
        CoreApiErrorType.INTERNAL_SERVER_ERROR.getStatus());
  }
}

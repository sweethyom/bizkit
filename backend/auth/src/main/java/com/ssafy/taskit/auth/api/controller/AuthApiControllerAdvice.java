package com.ssafy.taskit.auth.api.controller;

import com.ssafy.taskit.auth.api.error.AuthCoreApiException;
import com.ssafy.taskit.auth.api.error.AuthErrorMessage;
import com.ssafy.taskit.auth.api.response.AuthApiResponse;
import com.ssafy.taskit.auth.domain.error.AuthCoreErrorKind;
import com.ssafy.taskit.auth.domain.error.AuthCoreException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice(basePackageClasses = AuthApiControllerAdvice.class)
public class AuthApiControllerAdvice {

  private final Logger log = LoggerFactory.getLogger(getClass());

  private static final String CORE_API_EXCEPTION_LOG_FORMAT = "CoreApiException : {}";
  private static final String CORE_EXCEPTION_LOG_FORMAT = "CoreException : {}";

  @ExceptionHandler(AuthCoreApiException.class)
  public ResponseEntity<AuthApiResponse<Void>> handleCoreApiException(AuthCoreApiException e) {
    switch (e.getErrorType().getLevel()) {
      case ERROR:
        log.error(CORE_API_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
        break;
      case WARN:
        log.warn(CORE_API_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
        break;
      default:
        log.info(CORE_API_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
        break;
    }

    AuthErrorMessage errorMessage = new AuthErrorMessage(e.getErrorType(), e.getMessage());
    return new ResponseEntity<>(
        AuthApiResponse.error(errorMessage), e.getErrorType().getStatus());
  }

  @ExceptionHandler(AuthCoreException.class)
  public ResponseEntity<AuthApiResponse<Void>> handleCoreException(AuthCoreException e) {
    switch (e.getErrorType().getLevel()) {
      case ERROR:
        log.error(CORE_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
        break;
      case WARN:
        log.warn(CORE_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
        break;
      default:
        log.info(CORE_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
        break;
    }

    HttpStatus status = e.getErrorType().getKind() == AuthCoreErrorKind.CLIENT_ERROR
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;

    AuthErrorMessage errorMessage = new AuthErrorMessage(e.getErrorType(), e.getMessage());
    return new ResponseEntity<>(AuthApiResponse.error(errorMessage), status);
  }
}

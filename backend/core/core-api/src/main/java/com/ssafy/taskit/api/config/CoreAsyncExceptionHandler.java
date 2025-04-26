package com.ssafy.taskit.api.config;

import com.ssafy.taskit.domain.error.CoreException;
import java.lang.reflect.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class CoreAsyncExceptionHandler implements AsyncExceptionHandler {
  private static final String CORE_EXCEPTION_LOG_FORMAT = "CoreException : {}";
  private final Logger log = LoggerFactory.getLogger(getClass());

  @Override
  public boolean supports(Throwable exception) {
    return exception instanceof CoreException;
  }

  @Override
  public void handle(Throwable e, Method method, Object... params) {
    CoreException coreException = (CoreException) e;
    switch (coreException.getErrorType().getLevel()) {
      case ERROR -> log.error(CORE_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
      case WARN -> log.warn(CORE_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
      default -> log.info(CORE_EXCEPTION_LOG_FORMAT, e.getMessage(), e);
    }
  }
}

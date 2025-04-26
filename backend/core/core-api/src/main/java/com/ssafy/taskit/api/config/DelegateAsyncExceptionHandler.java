package com.ssafy.taskit.api.config;

import java.lang.reflect.Method;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;

public class DelegateAsyncExceptionHandler implements AsyncUncaughtExceptionHandler {
  private final Logger log = LoggerFactory.getLogger(getClass());
  private final List<AsyncExceptionHandler> handlers;

  public DelegateAsyncExceptionHandler(List<AsyncExceptionHandler> handlers) {
    this.handlers = handlers;
  }

  @Override
  public void handleUncaughtException(Throwable e, Method method, Object... params) {
    for (AsyncExceptionHandler handler : handlers) {
      if (handler.supports(e)) {
        handler.handle(e, method, params);
        return;
      }
    }
    log.error("Unhandled async exception : {}", e.getMessage(), e);
  }
}

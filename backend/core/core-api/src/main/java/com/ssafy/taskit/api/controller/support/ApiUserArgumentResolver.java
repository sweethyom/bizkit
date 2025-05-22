package com.ssafy.taskit.api.controller.support;

import com.ssafy.taskit.api.controller.ApiUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class ApiUserArgumentResolver implements HandlerMethodArgumentResolver {

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return parameter.getParameterType().equals(ApiUser.class);
  }

  @Override
  public Object resolveArgument(
      MethodParameter parameter,
      ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest,
      WebDataBinderFactory binderFactory) {
    HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
    Object userIdObj = request.getAttribute("userId");

    if (userIdObj == null) {
      throw new IllegalArgumentException("User ID not found in request attributes");
    }

    Long userId;
    try {
      userId = (Long) userIdObj;
    } catch (ClassCastException e) {
      throw new IllegalArgumentException("Invalid userId type in request attributes", e);
    }

    return new ApiUser(userId);
  }
}

package com.ssafy.taskit.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.Assert;

public class JsonLoginProcessingFilter extends AbstractAuthenticationProcessingFilter {

  public static final String DEFAULT_USERNAME_KEY = "username";
  public static final String DEFAULT_PASSWORD_KEY = "password";

  private static final AntPathRequestMatcher DEFAULT_ANT_PATH_REQUEST_MATCHER =
      new AntPathRequestMatcher("/auth/login", "POST");

  private final ObjectMapper objectMapper;

  private String usernameParameter = DEFAULT_USERNAME_KEY;
  private String passwordParameter = DEFAULT_PASSWORD_KEY;

  private boolean postOnly = true;

  public JsonLoginProcessingFilter(ObjectMapper objectMapper) {
    super(DEFAULT_ANT_PATH_REQUEST_MATCHER);
    this.objectMapper = objectMapper;
  }

  @Override
  public Authentication attemptAuthentication(
      HttpServletRequest request, HttpServletResponse response)
      throws AuthenticationException, IOException {
    if (this.postOnly && !request.getMethod().equals(HttpMethod.POST.name())) {
      throw new AuthenticationServiceException(
          "Authentication method not supported: " + request.getMethod());
    }

    if (Objects.isNull(request.getContentType())
        || !request.getContentType().contains(MediaType.APPLICATION_JSON_VALUE)) {
      throw new AuthenticationServiceException(
          "Authentication Content-Type not supported: " + request.getContentType());
    }

    ServletInputStream inputStream = request.getInputStream();
    Map<String, String> usernamePasswordMap =
        objectMapper.readValue(inputStream, new TypeReference<>() {});

    String username = obtainParameter(usernameParameter, usernamePasswordMap);
    String password = obtainParameter(passwordParameter, usernamePasswordMap);

    AuthUserDetails details = new AuthUserDetails(username, password);

    UsernamePasswordAuthenticationToken authRequest =
        UsernamePasswordAuthenticationToken.unauthenticated(username, password);

    this.setDetails(details, authRequest);
    return getAuthenticationManager().authenticate(authRequest);
  }

  private String obtainParameter(String parameter, Map<String, String> usernameParameterMap) {
    String value = usernameParameterMap.get(parameter);
    if (Objects.isNull(value)) {
      return null;
    }

    return value;
  }

  protected void setDetails(
      AuthUserDetails details, UsernamePasswordAuthenticationToken authRequest) {
    authRequest.setDetails(details);
  }

  public void postOnly(boolean postOnly) {
    this.postOnly = postOnly;
  }

  public final String getUsernameParameter() {
    return this.usernameParameter;
  }

  public void setUsernameParameter(String usernameParameter) {
    Assert.hasText(usernameParameter, "Username parameter must not be empty or null");
    this.usernameParameter = usernameParameter;
  }

  public final String getPasswordParameter() {
    return this.passwordParameter;
  }

  public void setPasswordParameter(String passwordParameter) {
    Assert.hasText(passwordParameter, "Password parameter must not be empty or null");
    this.passwordParameter = passwordParameter;
  }
}

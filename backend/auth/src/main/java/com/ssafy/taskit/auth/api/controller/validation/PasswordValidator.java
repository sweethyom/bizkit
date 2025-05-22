package com.ssafy.taskit.auth.api.controller.validation;

public class PasswordValidator extends AuthRegexValidator<Password> {
  private static final String REGEX = "^[A-Za-z0-9!@#$%^&*()_+\\-=~]{8,16}$";

  @Override
  protected String getRegex(Password constraintAnnotation) {
    return REGEX;
  }
}

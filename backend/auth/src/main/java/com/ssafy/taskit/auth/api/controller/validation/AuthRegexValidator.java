package com.ssafy.taskit.auth.api.controller.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.annotation.Annotation;
import java.util.regex.Pattern;

public abstract class AuthRegexValidator<T extends Annotation>
    implements ConstraintValidator<T, String> {
  protected Pattern pattern;

  @Override
  public void initialize(T constraintAnnotation) {
    String regex = getRegex(constraintAnnotation);
    this.pattern = Pattern.compile(regex);
  }

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null) {
      return false;
    }
    return pattern.matcher(value).matches();
  }

  protected abstract String getRegex(T constraintAnnotation);
}

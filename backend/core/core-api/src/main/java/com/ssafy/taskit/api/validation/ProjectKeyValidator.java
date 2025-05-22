package com.ssafy.taskit.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ProjectKeyValidator implements ConstraintValidator<ProjectKey, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null) return false;

    String stripedValue = value.strip();
    if (stripedValue.length() != value.length()) return false;
    if (stripedValue.isEmpty() || stripedValue.length() > 10) return false;
    return stripedValue.matches("^[A-Z0-9]+$");
  }
}

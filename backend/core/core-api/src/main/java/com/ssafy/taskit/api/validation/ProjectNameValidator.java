package com.ssafy.taskit.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ProjectNameValidator implements ConstraintValidator<ProjectName, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    String stripedValue = value.strip();
    if (stripedValue.length() != value.length()) {
      return false;
    }
    return !stripedValue.isEmpty() && stripedValue.length() <= 40;
  }
}

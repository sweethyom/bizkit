package com.ssafy.taskit.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.nio.charset.StandardCharsets;

public class ProjectNameValidator implements ConstraintValidator<ProjectName, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null) {
      return false;
    }
    String stripedValue = value.strip();
    if (!stripedValue.equals(value)) {
      return false;
    }
    return !stripedValue.isEmpty() && stripedValue.getBytes(StandardCharsets.UTF_8).length <= 40;
  }
}

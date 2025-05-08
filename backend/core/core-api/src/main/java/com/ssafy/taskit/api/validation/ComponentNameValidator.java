package com.ssafy.taskit.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.nio.charset.StandardCharsets;

public class ComponentNameValidator implements ConstraintValidator<ComponentName, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null) return true; // null은 별도 처리
    return value.getBytes(StandardCharsets.UTF_8).length <= 20;
  }
}

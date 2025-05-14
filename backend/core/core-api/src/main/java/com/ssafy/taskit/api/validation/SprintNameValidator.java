package com.ssafy.taskit.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.nio.charset.StandardCharsets;

public class SprintNameValidator implements ConstraintValidator<SprintName, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null) return true;
    String stripValue = value.strip();
    return stripValue.getBytes(StandardCharsets.UTF_8).length <= 40;
  }
}

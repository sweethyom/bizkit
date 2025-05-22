package com.ssafy.taskit.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.nio.charset.StandardCharsets;

public class IssueNameValidator implements ConstraintValidator<IssueName, String> {

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    String stripedValue = value.strip();
    if (stripedValue.length() != value.length()) {
      return false;
    }
    return !stripedValue.isEmpty() && stripedValue.getBytes(StandardCharsets.UTF_8).length <= 40;
  }
}

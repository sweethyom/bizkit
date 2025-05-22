package com.ssafy.taskit.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class BizPointValidator implements ConstraintValidator<BizPoint, Long> {

  @Override
  public boolean isValid(Long value, ConstraintValidatorContext context) {
    return value > 0;
  }
}

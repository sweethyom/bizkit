package com.ssafy.taskit.auth.api.controller.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AuthFileSizeValidator.class)
public @interface AuthFileSize {
  String message() default "파일 크기는 {max}MB를 초과할 수 없습니다";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  long max() default 5;
}

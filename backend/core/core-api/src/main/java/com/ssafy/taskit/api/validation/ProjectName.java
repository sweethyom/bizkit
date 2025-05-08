package com.ssafy.taskit.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ProjectNameValidator.class)
public @interface ProjectName {
  String message() default "프로젝트 이름 생성 시 앞뒤 공백 없이 40bytes 이내여야 합니다.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}

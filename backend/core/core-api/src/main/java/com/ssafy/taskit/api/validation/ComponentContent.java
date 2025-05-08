package com.ssafy.taskit.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ComponentContentValidator.class)
public @interface ComponentContent {

  String message() default "컴포넌트 설명은 앞뒤 공백 없이 UTF-8 기준 100bytes를 초과할 수 없습니다.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}

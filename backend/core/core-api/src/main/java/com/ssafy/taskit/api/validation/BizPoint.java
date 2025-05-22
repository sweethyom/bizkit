package com.ssafy.taskit.api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER}) // ← 둘 다 포함
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = BizPointValidator.class)
public @interface BizPoint {

  String message() default "비즈 포인트는 양수여야 합니다.";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}

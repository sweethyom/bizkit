package com.ssafy.taskit.auth.api.controller.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

public class AuthFileSizeValidator implements ConstraintValidator<AuthFileSize, MultipartFile> {
  private long maxBytes;

  @Override
  public void initialize(AuthFileSize constraintAnnotation) {
    this.maxBytes = constraintAnnotation.max() * 1024 * 1024;
  }

  @Override
  public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
    return file == null || file.getSize() <= maxBytes;
  }
}

package com.ssafy.taskit.api.validation;

import com.ssafy.taskit.domain.ProjectRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ProjectKeyValidator implements ConstraintValidator<ProjectKey, String> {

  private final ProjectRepository projectRepository;

  public ProjectKeyValidator(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null) {
      return false;
    }

    String stripedValue = value.strip();
    if (stripedValue.length() != value.length()) {
      return false;
    }
    if (stripedValue.isEmpty() || stripedValue.length() > 10) {
      return false;
    }
    if (!stripedValue.matches("^[A-Z0-9]+$")) {
      return false;
    }
    return projectRepository.findByKey(value).isEmpty();
  }
}

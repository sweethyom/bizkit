package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class ProjectValidator {
  private final ProjectRepository projectRepository;

  public ProjectValidator(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public boolean isProjectExists(Long projectId) {
    if (!projectRepository.existProject(projectId)) {
      throw new CoreException(CoreErrorType.PROJECT_NOT_FOUND);
    }
    return true;
  }
}

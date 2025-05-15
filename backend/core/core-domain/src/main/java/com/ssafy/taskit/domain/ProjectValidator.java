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

  public void isProjectExists(String key) {
    if (projectRepository.findByKey(key).isPresent()) {
      throw new CoreException(CoreErrorType.DUPLICATED_PROJECT_KEY);
    }
    ;
  }
}

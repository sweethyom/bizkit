package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class ProjectAppender {
  private final ProjectRepository projectRepository;
  private final ProjectValidator projectValidator;

  public ProjectAppender(ProjectRepository projectRepository, ProjectValidator projectValidator) {
    this.projectRepository = projectRepository;
    this.projectValidator = projectValidator;
  }

  public Project append(User user, NewProject newProject) {
    if (projectRepository.findByKey(newProject.key()).isPresent()) {
      throw new CoreException(CoreErrorType.DUPLICATED_PROJECT_KEY);
    }
    return projectRepository.save(user, newProject, null, 0);
  }
}

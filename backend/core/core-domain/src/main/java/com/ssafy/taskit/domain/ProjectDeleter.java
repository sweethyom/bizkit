package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class ProjectDeleter {
  private final ProjectRepository projectRepository;
  private final ProjectValidator projectValidator;

  public ProjectDeleter(ProjectRepository projectRepository, ProjectValidator projectValidator) {
    this.projectRepository = projectRepository;
    this.projectValidator = projectValidator;
  }

  public void deleteProject(Long projectId) {
    projectValidator.isProjectExists(projectId);
    projectRepository.deleteProject(projectId);
  }
}

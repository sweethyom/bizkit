package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class ProjectAppender {
  private final ProjectRepository projectRepository;
  private final ProjectValidator projectValidator;

  public ProjectAppender(ProjectRepository projectRepository, ProjectValidator projectValidator) {
    this.projectRepository = projectRepository;
    this.projectValidator = projectValidator;
  }

  public Project append(User user, NewProject newProject, String image) {
    return projectRepository.save(user, newProject, image);
  }
}

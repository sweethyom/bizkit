package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class ProjectAppender {
  private final ProjectRepository projectRepository;

  public ProjectAppender(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public Project append(User user, NewProject newProject) {
    return projectRepository.save(user, newProject, null, 0);
  }
}

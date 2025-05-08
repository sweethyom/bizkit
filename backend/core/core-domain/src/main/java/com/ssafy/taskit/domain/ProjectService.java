package com.ssafy.taskit.domain;

import org.springframework.stereotype.Service;

@Service
public class ProjectService {

  private final ProjectAppender projectAppender;

  public ProjectService(ProjectAppender projectAppender) {
    this.projectAppender = projectAppender;
  }

  public Long append(User user, NewProject newProject) {
    Project project = projectAppender.append(user, newProject);

    return project.getId();
  }
}

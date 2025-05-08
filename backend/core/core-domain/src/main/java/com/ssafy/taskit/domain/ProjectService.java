package com.ssafy.taskit.domain;

import org.springframework.stereotype.Service;

@Service
public class ProjectService {

  private final ProjectAppender projectAppender;

  public ProjectService(
      ProjectAppender projectAppender, ProjectSequenceAppender projectSequenceAppender) {
    this.projectAppender = projectAppender;
  }

  public Long append(User user, NewProject newProject, String image) {
    Project project = projectAppender.append(user, newProject, image);
    return project.getId();
  }
}

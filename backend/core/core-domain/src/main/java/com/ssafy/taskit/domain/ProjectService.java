package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

  private final ProjectAppender projectAppender;
  private final ProjectReader projectReader;

  public ProjectService(ProjectAppender projectAppender, ProjectReader projectReader) {
    this.projectAppender = projectAppender;
    this.projectReader = projectReader;
  }

  public Long append(User user, NewProject newProject) {
    Project project = projectAppender.append(user, newProject);

    return project.id();
  }

  public List<Project> findProjects(User user, ProjectSort sortType) {
    return projectReader.readProjectsByRecentView(user, sortType);
  }
}

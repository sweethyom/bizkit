package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ProjectReader {
  private final ProjectRepository projectRepository;

  public ProjectReader(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public List<Project> readProjects(User user) {
    return projectRepository.findByUser(user);
  }
}

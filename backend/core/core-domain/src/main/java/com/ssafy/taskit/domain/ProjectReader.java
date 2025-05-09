package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ProjectReader {
  private final ProjectRepository projectRepository;

  public ProjectReader(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public List<Project> readProjectsByRecentView(User user, ProjectSort sortType) {
    List<Long> projectIds = projectRepository.findUserProjectIds(user, sortType);
    return projectRepository.findAllByIds(projectIds);
  }
}

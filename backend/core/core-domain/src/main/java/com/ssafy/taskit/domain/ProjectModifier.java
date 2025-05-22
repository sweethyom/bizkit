package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class ProjectModifier {

  ProjectRepository projectRepository;

  public ProjectModifier(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  ProjectDetail modifyProjectName(Long projectId, String name, boolean isLeader) {
    return projectRepository.modifyProjectName(projectId, name, isLeader);
  }

  void modifyProjectImage(Long projectId, String ImageUrl, boolean isLeader) {
    projectRepository.modifyProjectImage(projectId, ImageUrl, isLeader);
  }
}

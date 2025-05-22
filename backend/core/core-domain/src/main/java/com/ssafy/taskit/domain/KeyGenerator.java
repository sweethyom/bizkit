package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class KeyGenerator {

  private final ProjectRepository projectRepository;

  public KeyGenerator(ProjectRepository projectRepository) {
    this.projectRepository = projectRepository;
  }

  public String generateKey(Long projectId) {
    Project project = projectRepository.findById(projectId);
    project = project.nextSequence();
    projectRepository.update(project);
    return project.generateKey();
  }
}

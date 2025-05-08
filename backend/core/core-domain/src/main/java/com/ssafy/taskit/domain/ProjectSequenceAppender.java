package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class ProjectSequenceAppender {
  private final ProjectSequenceRepository projectSequenceRepository;

  public ProjectSequenceAppender(ProjectSequenceRepository projectSequenceRepository) {
    this.projectSequenceRepository = projectSequenceRepository;
  }

  public ProjectSequence appendProjectSequence(
      Long projectId, NewProjectSequence newProjectSequence) {
    return projectSequenceRepository.save(projectId, newProjectSequence);
  }
}

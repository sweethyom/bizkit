package com.ssafy.taskit.domain;

import org.springframework.stereotype.Service;

@Service
public class ProjectSequenceService {
  private final ProjectSequenceAppender projectSequenceAppender;

  public ProjectSequenceService(ProjectSequenceAppender projectSequenceAppender) {
    this.projectSequenceAppender = projectSequenceAppender;
  }

  public Long appendProjectSequence(Long projectId, NewProjectSequence newProjectSequence) {
    ProjectSequence projectSequence =
        projectSequenceAppender.appendProjectSequence(projectId, newProjectSequence);
    return projectSequence.getId();
  }
}

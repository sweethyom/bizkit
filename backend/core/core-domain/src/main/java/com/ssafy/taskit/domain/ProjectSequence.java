package com.ssafy.taskit.domain;

public class ProjectSequence {
  private final Long id;
  private final Long projectId;
  private int currentSequence;

  public ProjectSequence(Long id, Long projectId, int currentSequence) {
    this.id = id;
    this.projectId = projectId;
    this.currentSequence = currentSequence;
  }

  public Long getId() {
    return id;
  }

  public int getCurrentSequence() {
    return currentSequence;
  }
}

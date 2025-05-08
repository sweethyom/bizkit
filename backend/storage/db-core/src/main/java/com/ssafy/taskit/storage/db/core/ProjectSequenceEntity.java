package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.ProjectSequence;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "projectsequence")
@Entity
public class ProjectSequenceEntity extends BaseEntity {
  private Long projectId;
  private int currentSequence;

  protected ProjectSequenceEntity() {}

  public ProjectSequenceEntity(Long projectId, int currentSequence) {
    this.projectId = projectId;
    this.currentSequence = currentSequence;
  }

  public ProjectSequence toProjectSequence() {
    return new ProjectSequence(this.getId(), this.projectId, this.currentSequence);
  }
}

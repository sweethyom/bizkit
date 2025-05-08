package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.NewProjectSequence;
import com.ssafy.taskit.domain.ProjectSequence;
import com.ssafy.taskit.domain.ProjectSequenceRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectSequenceCoreRepository implements ProjectSequenceRepository {
  private final ProjectSequenceJpaRepository projectSequenceJpaRepository;

  public ProjectSequenceCoreRepository(ProjectSequenceJpaRepository projectSequenceJpaRepository) {
    this.projectSequenceJpaRepository = projectSequenceJpaRepository;
  }

  @Override
  public ProjectSequence save(Long projectId, NewProjectSequence newProjectSequence) {
    return projectSequenceJpaRepository
        .save(new ProjectSequenceEntity(projectId, newProjectSequence.currentSequence()))
        .toProjectSequence();
  }
}

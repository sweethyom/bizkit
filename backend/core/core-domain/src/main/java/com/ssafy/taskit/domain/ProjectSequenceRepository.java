package com.ssafy.taskit.domain;

public interface ProjectSequenceRepository {
  ProjectSequence save(Long projectId, NewProjectSequence newProjectSequence);
}

package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.NewSprint;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintRepository;
import com.ssafy.taskit.domain.User;
import org.springframework.stereotype.Repository;

@Repository
public class SprintCoreRepository implements SprintRepository {

  private final SprintJpaRepository sprintJpaRepository;

  public SprintCoreRepository(SprintJpaRepository sprintJpaRepository) {
    this.sprintJpaRepository = sprintJpaRepository;
  }

  @Override
  public Sprint save(User user, Long projectId, NewSprint newSprint) {
    return sprintJpaRepository
        .save(new SprintEntity(newSprint.name(), projectId))
        .toSprint();
  }
}

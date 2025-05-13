package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.NewSprint;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintRepository;
import com.ssafy.taskit.domain.User;
import java.util.List;
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

  @Override
  public List<Sprint> findSprints(Long projectId) {
    List<SprintEntity> sprintEntities =
        sprintJpaRepository.findAllByProjectIdAndEntityStatus(projectId, EntityStatus.ACTIVE);
    return sprintEntities.stream().map(SprintEntity::toSprint).toList();
  }
}

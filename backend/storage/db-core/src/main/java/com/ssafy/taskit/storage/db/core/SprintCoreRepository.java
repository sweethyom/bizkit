package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.ModifySprintDueDate;
import com.ssafy.taskit.domain.ModifySprintName;
import com.ssafy.taskit.domain.NewSprint;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintRepository;
import com.ssafy.taskit.domain.User;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
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

  @Override
  public Optional<Sprint> findSprint(Long sprintId) {
    return sprintJpaRepository
        .findBySprintIdAndEntityStatus(sprintId, EntityStatus.ACTIVE)
        .map(SprintEntity::toSprint);
  }

  @Transactional
  @Override
  public void modifySprintName(Long sprintId, ModifySprintName modifySprintName) {
    SprintEntity sprintEntity = sprintJpaRepository
        .findBySprintIdAndEntityStatus(sprintId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));
    sprintEntity.updateSprintName(modifySprintName.name());
  }

  @Transactional
  @Override
  public void modifySprintDueDate(Long sprintId, ModifySprintDueDate modifySprintDueDate) {
    SprintEntity sprintEntity = sprintJpaRepository
        .findBySprintIdAndEntityStatus(sprintId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));
    sprintEntity.updateSprintDueDate(modifySprintDueDate.dueDate());
  }
}

package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.EpicRepository;
import com.ssafy.taskit.domain.ModifyEpic;
import com.ssafy.taskit.domain.NewEpic;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class EpicCoreRepository implements EpicRepository {

  private final EpicJpaRepository epicJpaRepository;

  public EpicCoreRepository(EpicJpaRepository epicJpaRepository) {
    this.epicJpaRepository = epicJpaRepository;
  }

  @Override
  public Epic save(Long projectId, NewEpic newEpic, String key) {
    return epicJpaRepository
        .save(new EpicEntity(newEpic.name(), key, projectId))
        .toEpic();
  }

  @Override
  public List<Epic> findEpics(Long projectId) {
    List<EpicEntity> epicEntities =
        epicJpaRepository.findByProjectIdAndEntityStatus(projectId, EntityStatus.ACTIVE);
    return epicEntities.stream().map(EpicEntity::toEpic).toList();
  }

  @Override
  public boolean existsById(Long epicId) {
    return epicJpaRepository.existsByIdAndEntityStatus(epicId, EntityStatus.ACTIVE);
  }

  @Override
  public Epic findById(Long epicId) {
    return epicJpaRepository
        .findByEpicIdAndEntityStatus(epicId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND))
        .toEpic();
  }

  @Override
  public void modifyEpic(Long epicId, ModifyEpic modifyEpic) {
    EpicEntity epicEntity = epicJpaRepository
        .findByEpicIdAndEntityStatus(epicId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    epicEntity.updateEpicName(modifyEpic.name());
    epicJpaRepository.save(epicEntity);
  }
}

package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.EpicRepository;
import com.ssafy.taskit.domain.NewEpic;
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
}

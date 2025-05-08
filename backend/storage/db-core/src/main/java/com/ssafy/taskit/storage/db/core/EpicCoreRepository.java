package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.EpicRepository;
import com.ssafy.taskit.domain.ModifyEpic;
import com.ssafy.taskit.domain.NewEpic;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class EpicCoreRepository implements EpicRepository {

  private final EpicJpaRepository epicJpaRepository;
  private final IssueJpaRepository issueJpaRepository;

  public EpicCoreRepository(
      EpicJpaRepository epicJpaRepository, IssueJpaRepository issueJpaRepository) {
    this.epicJpaRepository = epicJpaRepository;
    this.issueJpaRepository = issueJpaRepository;
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

  @Transactional
  @Override
  public void deleteEpic(Long epicId) {
    List<IssueEntity> issueEntities =
        issueJpaRepository.findByEpicIdAndEntityStatus(epicId, EntityStatus.ACTIVE);
    issueEntities.forEach(issueEntity -> issueEntity.delete());
    EpicEntity epicEntity = epicJpaRepository
        .findByEpicIdAndEntityStatus(epicId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    epicEntity.delete();
  }
}

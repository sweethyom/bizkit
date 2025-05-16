package com.ssafy.taskit.storage.db.core;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponentJpaRepository extends JpaRepository<ComponentEntity, Long> {
  Optional<ComponentEntity> findByProjectIdAndName(Long projectId, String name);

  boolean existsByIdAndProjectId(Long id, Long projectId);

  boolean existsByProjectIdAndName(Long projectId, String name);

  List<ComponentEntity> findAllByProjectIdAndEntityStatus(
      Long projectId, EntityStatus entityStatus);

  Optional<ComponentEntity> findByIdAndEntityStatus(Long id, EntityStatus entityStatus);

  List<ComponentEntity> findAllByIdInAndEntityStatus(List<Long> ids, EntityStatus entityStatus);
}

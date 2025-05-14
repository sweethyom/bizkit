package com.ssafy.taskit.storage.db.core;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponentJpaRepository extends JpaRepository<ComponentEntity, Long> {
  boolean existsByProjectIdAndName(Long projectId, String name);

  boolean existsByIdAndProjectId(Long id, Long projectId);

  List<ComponentEntity> findAllByProjectIdAndEntityStatus(
      Long projectId, EntityStatus entityStatus);

  Optional<ComponentEntity> findByIdAndEntityStatus(Long id, EntityStatus entityStatus);
}

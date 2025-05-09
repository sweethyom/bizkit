package com.ssafy.taskit.storage.db.core;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponentJpaRepository extends JpaRepository<ComponentEntity, Long> {
  boolean existsByProjectIdAndName(Long projectId, String name);

  List<ComponentEntity> findAllByProjectId(Long projectId);
}

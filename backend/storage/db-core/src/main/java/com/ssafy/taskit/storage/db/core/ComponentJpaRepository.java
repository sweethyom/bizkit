package com.ssafy.taskit.storage.db.core;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ComponentJpaRepository extends JpaRepository<ComponentEntity, Long> {
  boolean existsByProjectIdAndName(Long projectId, String name);
}

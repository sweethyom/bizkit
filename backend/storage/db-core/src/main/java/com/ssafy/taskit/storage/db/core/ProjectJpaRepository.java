package com.ssafy.taskit.storage.db.core;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectJpaRepository extends JpaRepository<ProjectEntity, Long> {
  Optional<ProjectEntity> findById(Long userId);

  Optional<ProjectEntity> findByKey(String key);

  List<ProjectEntity> findByUserId(Long userId);
}

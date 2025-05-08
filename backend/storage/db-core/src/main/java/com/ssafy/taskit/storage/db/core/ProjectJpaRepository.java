package com.ssafy.taskit.storage.db.core;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectJpaRepository extends JpaRepository<ProjectEntity, Long> {
  Optional<ProjectEntity> findById(Long userId);

  Optional<ProjectEntity> findByKey(String key);

  @Modifying
  @Query("UPDATE ProjectEntity p SET p.viewedAt = :viewedAt WHERE p.id = :projectId")
  void updateViewedAt(
      @Param("projectId") Long projectId, @Param("viewedAt") LocalDateTime viewedAt);
}

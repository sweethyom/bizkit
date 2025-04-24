package com.ssafy.s12p21d206.achu.storage.db.core;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoryJpaRepository extends JpaRepository<MemoryEntity, Long> {
  Optional<MemoryEntity> findByIdAndEntityStatus(Long memoryId, EntityStatus entityStatus);

  List<MemoryEntity> findByBabyIdAndEntityStatus(
      Long babyId, Pageable pageable, EntityStatus entityStatus);

  boolean existsByIdAndEntityStatus(Long memoryId, EntityStatus entityStatus);
}

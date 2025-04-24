package com.ssafy.s12p21d206.achu.storage.db.core;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BabyJpaRepository extends JpaRepository<BabyEntity, Long> {
  List<BabyEntity> findByUserIdAndEntityStatus(Long userId, EntityStatus entityStatus);

  Optional<BabyEntity> findByIdAndEntityStatus(Long id, EntityStatus entityStatus);

  boolean existsByIdAndEntityStatus(Long id, EntityStatus entityStatus);

  boolean existsByIdAndUserIdAndEntityStatus(Long id, Long userId, EntityStatus entityStatus);

  int countByUserIdAndEntityStatus(Long id, EntityStatus entityStatus);
}

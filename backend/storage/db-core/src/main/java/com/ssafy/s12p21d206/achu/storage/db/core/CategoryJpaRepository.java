package com.ssafy.s12p21d206.achu.storage.db.core;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryJpaRepository extends JpaRepository<CategoryEntity, Long> {
  boolean existsByIdAndEntityStatus(Long id, EntityStatus entityStatus);
}

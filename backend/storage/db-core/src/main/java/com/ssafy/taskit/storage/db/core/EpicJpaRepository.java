package com.ssafy.taskit.storage.db.core;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EpicJpaRepository extends JpaRepository<EpicEntity, Long> {
  List<EpicEntity> findByProjectIdAndEntityStatus(Long projectId, EntityStatus entityStatus);
}

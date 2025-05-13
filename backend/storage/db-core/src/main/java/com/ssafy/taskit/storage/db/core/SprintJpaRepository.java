package com.ssafy.taskit.storage.db.core;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprintJpaRepository extends JpaRepository<SprintEntity, Long> {

  List<SprintEntity> findAllByProjectIdAndEntityStatus(Long projectId, EntityStatus entityStatus);
}

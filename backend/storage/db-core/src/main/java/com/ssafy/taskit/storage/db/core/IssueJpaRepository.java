package com.ssafy.taskit.storage.db.core;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueJpaRepository extends JpaRepository<IssueEntity, Long> {

  List<IssueEntity> findByEpicIdAndEntityStatus(Long epicId, EntityStatus entityStatus);
}

package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.IssueStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IssueJpaRepository extends JpaRepository<IssueEntity, Long> {

  List<IssueEntity> findByEpicIdAndEntityStatus(Long epicId, EntityStatus entityStatus);

  @Query("SELECT i FROM IssueEntity i " + "WHERE i.epicId = :epicId "
      + "AND i.entityStatus = :entityStatus "
      + "AND i.issueStatus = :issueStatus "
      + "ORDER BY i.createdAt ASC")
  List<IssueEntity> findAllByEpicIdAndEntityStatus(
      @Param("epicId") Long epicId,
      @Param("entityStatus") EntityStatus entityStatus,
      @Param("issueStatus") IssueStatus issueStatus);
}

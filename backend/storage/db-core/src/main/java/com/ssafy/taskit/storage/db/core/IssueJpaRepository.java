package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.SprintStatus;
import java.util.List;
import java.util.Optional;
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

  boolean existsByIssueIdAndEntityStatus(Long issueId, EntityStatus entityStatus);

  Optional<IssueEntity> findByIssueIdAndEntityStatus(Long issueId, EntityStatus entityStatus);

  List<IssueEntity> findBySprintIdAndEntityStatus(Long sprintId, EntityStatus entityStatus);

  @Query(
      """
  SELECT i
  FROM IssueEntity i
  JOIN SprintEntity s ON i.sprintId = s.id
  WHERE (:componentId IS NULL AND i.componentId IS NULL
         OR i.componentId = :componentId)
    AND i.entityStatus = :entityStatus
    AND s.sprintStatus = :sprintStatus
  """)
  List<IssueEntity> findAllByComponentIdAndEntityStatus(
      @Param("componentId") Long componentId,
      @Param("entityStatus") EntityStatus entityStatus,
      @Param("sprintStatus") SprintStatus sprintStatus);
}

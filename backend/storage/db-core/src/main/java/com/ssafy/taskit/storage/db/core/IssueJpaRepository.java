package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.SprintStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
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

  boolean existsByIdAndEntityStatus(Long issueId, EntityStatus entityStatus);

  Optional<IssueEntity> findByIdAndEntityStatus(Long issueId, EntityStatus entityStatus);

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

  @Query(
      """
  SELECT i
  FROM IssueEntity i
  WHERE i.assigneeId = :assigneeId
    AND i.entityStatus = :entityStatus
    AND i.issueStatus = :issueStatus
  ORDER BY i.updatedAt DESC, i.id DESC
""")
  List<IssueEntity> findMyIssuesFirstPage(
      @Param("assigneeId") Long userId,
      @Param("entityStatus") EntityStatus entityStatus,
      @Param("issueStatus") IssueStatus issueStatus,
      Pageable pageable);

  @Query(
      """
  SELECT i
  FROM IssueEntity i
  WHERE i.assigneeId = :assigneeId
    AND i.entityStatus = :entityStatus
    AND i.issueStatus = :issueStatus
    AND (
      i.updatedAt < :updatedAt
      OR (i.updatedAt = :updatedAt AND i.id < :cursorId)
    )
  ORDER BY i.updatedAt DESC, i.id DESC
""")
  List<IssueEntity> findMyIssuesAfterCursor(
      @Param("assigneeId") Long userId,
      @Param("entityStatus") EntityStatus entityStatus,
      @Param("issueStatus") IssueStatus issueStatus,
      @Param("updatedAt") LocalDateTime updatedAt,
      @Param("cursorId") Long cursorId,
      Pageable pageable);
}

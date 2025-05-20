package com.ssafy.taskit.storage.db.core;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectJpaRepository extends JpaRepository<ProjectEntity, Long> {

  Optional<ProjectEntity> findByKey(String key);

  @Query(
      "SELECT m.projectId FROM MemberEntity m JOIN ProjectEntity p ON m.projectId = p.id WHERE m.userId = :userId AND m.entityStatus = :memberStatus AND p.entityStatus = :projectStatus")
  List<Long> findProjectIdsByUserIdAndMemberStatusAndProjectStatus(
      Long userId, EntityStatus memberStatus, EntityStatus projectStatus, Sort sort);

  Optional<ProjectEntity> findByIdAndEntityStatus(Long id, EntityStatus entityStatus);

  boolean existsByIdAndEntityStatus(Long id, EntityStatus entityStatus);

  @Query("SELECT p FROM ProjectEntity p JOIN MemberEntity m ON p.id = m.projectId "
      + "WHERE p.id IN :projectIds "
      + "AND p.entityStatus = :status "
      + "AND (m.lastAccessedAt < :cursorUpdatedAt "
      + " OR (m.lastAccessedAt = :cursorUpdatedAt AND p.id < :cursorId)) "
      + "ORDER BY m.lastAccessedAt DESC, p.id DESC")
  List<ProjectEntity> findMyProjectsAfterCursor(
      @Param("projectIds") List<Long> projectIds,
      @Param("status") EntityStatus status,
      @Param("cursorUpdatedAt") LocalDateTime cursorUpdatedAt,
      @Param("cursorId") Long cursorId,
      Pageable pageable);

  @Query("SELECT p FROM ProjectEntity p JOIN MemberEntity m ON p.id = m.projectId "
      + "WHERE p.id IN :projectIds "
      + "ORDER BY m.lastAccessedAt DESC, p.id DESC")
  List<ProjectEntity> findMyProjectsFirstPage(
      @Param("projectIds") List<Long> projectIds, Pageable pageable);
}

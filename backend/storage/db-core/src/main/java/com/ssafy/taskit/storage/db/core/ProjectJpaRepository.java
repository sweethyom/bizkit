package com.ssafy.taskit.storage.db.core;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectJpaRepository extends JpaRepository<ProjectEntity, Long> {

  Optional<ProjectEntity> findByKey(String key);

  @Query(
      "SELECT m.projectId FROM MemberEntity m JOIN ProjectEntity p ON m.projectId = p.id WHERE m.userId = :userId AND m.entityStatus = :memberStatus AND p.entityStatus = :projectStatus")
  List<Long> findProjectIdsByUserIdAndMemberStatusAndProjectStatus(
      Long userId, EntityStatus memberStatus, EntityStatus projectStatus, Sort sort);

  Optional<ProjectEntity> findByIdAndEntityStatus(Long id, EntityStatus entityStatus);

  boolean existsByIdAndEntityStatus(Long id, EntityStatus entityStatus);
}

package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectJpaRepository extends JpaRepository<ProjectEntity, Long> {
  Optional<ProjectEntity> findById(Long userId);

  Optional<ProjectEntity> findByKey(String key);

  @Query("SELECT m.projectId FROM MemberEntity m WHERE m.userId = :userId")
  List<Long> findProjectIdsByUserId(@Param("userId") User user, Sort sort);

  Optional<ProjectEntity> findByIdAndEntityStatus(Long projectId, EntityStatus entityStatus);
}

package com.ssafy.taskit.storage.db.core;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberJpaRepository extends JpaRepository<MemberEntity, Long> {
  @Query("SELECT m.projectId FROM MemberEntity m WHERE m.userId = :userId ORDER BY m.viewedAt DESC")
  List<Long> findProjectIdsByUserIdOrderByViewedAtDesc(@Param("userId") Long userId);
}

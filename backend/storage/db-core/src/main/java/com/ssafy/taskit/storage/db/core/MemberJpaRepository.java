package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Role;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MemberJpaRepository extends JpaRepository<MemberEntity, Long> {
  Optional<MemberEntity> findByUserIdAndProjectIdAndMemberRole(
      Long userId, Long projectId, Role memberRole);

  @Modifying
  @Transactional
  @Query("UPDATE MemberEntity m SET m.lastAccessedAt = :lastAccessedAt "
      + "WHERE m.userId = :userId AND m.projectId = :projectId")
  void updateLastAccessedAt(
      @Param("userId") Long userId,
      @Param("projectId") Long projectId,
      @Param("lastAccessedAt") LocalDateTime lastAccessedAt);
}

package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.MemberRepository;
import com.ssafy.taskit.domain.Role;
import java.time.LocalDateTime;
import org.springframework.stereotype.Repository;

@Repository
public class MemberCoreRepository implements MemberRepository {
  private final MemberJpaRepository memberJpaRepository;

  public MemberCoreRepository(MemberJpaRepository memberJpaRepository) {
    this.memberJpaRepository = memberJpaRepository;
  }

  @Override
  public boolean isLeader(Long userId, Long projectId) {
    return memberJpaRepository
        .findByUserIdAndProjectIdAndMemberRole(userId, projectId, Role.LEADER)
        .isPresent();
  }

  @Override
  public void updateLastAccessedAt(Long userId, Long projectId, LocalDateTime lastAccessedAt) {
    memberJpaRepository.updateLastAccessedAt(userId, projectId, lastAccessedAt);
  }
}

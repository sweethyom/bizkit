package com.ssafy.taskit.domain;

import java.time.LocalDateTime;
import java.util.List;

public interface MemberRepository {
  boolean isLeader(Long userId, Long projectId);

  void updateLastAccessedAt(Long userId, Long projectId, LocalDateTime lastAccessedAt);

  boolean isMember(Long userId, Long projectId);

  List<Member> findMembers(Long projectId);

  Member findById(Long memberId);

  void deleteMember(Long memberId);

  Member findByUserIdAndProjectId(Long userId, Long projectId);

  int countMembers(Long projectId);

  Member save(Long userId, Long projectId, Role role, LocalDateTime lastAccessedAt);

  Member save(Member leader);
}

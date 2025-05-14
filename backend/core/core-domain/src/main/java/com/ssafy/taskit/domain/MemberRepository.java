package com.ssafy.taskit.domain;

import java.time.LocalDateTime;
import java.util.List;

public interface MemberRepository {
  boolean isLeader(Long userId, Long projectId);

  void updateLastAccessedAt(Long userId, Long projectId, LocalDateTime lastAccessedAt);

  boolean isMember(Long userId, Long projectId);

  List<Member> findMembers(Long projectId);

  Member findById(Long memberId);

  Long deleteMember(Long memberId);

  Long findByUserId(Long userId);

  int countMembers(Long projectId);
}

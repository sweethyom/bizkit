package com.ssafy.taskit.domain;

import java.time.LocalDateTime;

public interface MemberRepository {
  boolean isLeader(Long userId, Long projectId);

  void updateLastAccessedAt(Long userId, Long projectId, LocalDateTime lastAccessedAt);
}

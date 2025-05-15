package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;

public record Member(
    Long id,
    Long userId,
    Long projectId,
    Role memberRole,
    LocalDateTime lastAccessedAt,
    DefaultDateTime defaultDateTime) {

  public static Member createLeader(User user, Project project) {
    return new Member(null, user.id(), project.id(), Role.LEADER, null, null);
  }
}

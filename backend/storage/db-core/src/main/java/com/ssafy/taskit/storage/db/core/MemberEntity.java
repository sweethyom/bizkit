package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Member;
import com.ssafy.taskit.domain.Role;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Table(name = "member")
@Entity
public class MemberEntity extends BaseEntity {
  private Long userId;
  private Long projectId;

  @Enumerated(EnumType.STRING)
  private Role memberRole;

  private LocalDateTime lastAccessedAt;

  protected MemberEntity() {}

  public MemberEntity(Long userId, Long projectId, Role memberRole, LocalDateTime lastAccessedAt) {
    this.userId = userId;
    this.projectId = projectId;
    this.memberRole = memberRole;
    this.lastAccessedAt = lastAccessedAt;
  }

  public Member toMember() {
    return new Member(
        this.getId(),
        this.userId,
        this.projectId,
        this.memberRole,
        this.lastAccessedAt,
        new DefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
  }

  public Long getProjectId() {
    return projectId;
  }

  public LocalDateTime getLastAccessedAt() {
    return lastAccessedAt;
  }

  public void updateLastAccessedAt() {
    this.lastAccessedAt = LocalDateTime.now();
  }
}

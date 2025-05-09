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

  private LocalDateTime viewedAt;

  protected MemberEntity() {}

  public MemberEntity(Long userId, Long projectId, Role memberRole, LocalDateTime viewedAt) {
    this.userId = userId;
    this.projectId = projectId;
    this.memberRole = memberRole;
    this.viewedAt = viewedAt;
  }

  public Member toMember() {
    return new Member(
        this.getId(),
        this.userId,
        this.projectId,
        this.memberRole,
        this.viewedAt,
        new DefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
  }

  public Long getProjectId() {
    return projectId;
  }

  public LocalDateTime getViewedAt() {
    return viewedAt;
  }

  public void updateViewedAt() {
    this.viewedAt = LocalDateTime.now();
  }
}

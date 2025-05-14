package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Invitation;
import com.ssafy.taskit.domain.InvitationStatus;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Table(name = "invitation")
@Entity
public class InvitationEntity extends BaseEntity {
  Long userId;
  String email;
  Long projectId;
  String invitationCode;

  @Enumerated(EnumType.STRING)
  InvitationStatus status;

  protected InvitationEntity() {}

  public InvitationEntity(Long userId, String email, Long projectId, String invitationCode) {
    this.userId = userId;
    this.email = email;
    this.projectId = projectId;
    this.invitationCode = invitationCode;
    this.status = InvitationStatus.PENDING;
  }

  public Invitation toInvitation() {
    return new Invitation(
        this.getId(),
        this.userId,
        this.email,
        this.projectId,
        this.invitationCode,
        this.status,
        new DefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
  }

  public void accept() {
    this.status = InvitationStatus.ACCEPTED;
  }

  public void expire() {
    this.status = InvitationStatus.EXPIRED;
  }
}

package com.ssafy.taskit.domain;

public interface InvitationRepository {
  boolean isInvitationExists(Long userId);

  Invitation save(Long userId, NewInvitation newInvitation, Long projectId, String invitationCode);
}

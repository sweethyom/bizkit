package com.ssafy.taskit.domain;

import java.util.List;

public interface InvitationRepository {
  boolean isInvitationExists(Long userId);

  Invitation save(Long userId, NewInvitation newInvitation, Long projectId, String invitationCode);

  List<Invitation> findInvitationMembers(Long projectId);
}

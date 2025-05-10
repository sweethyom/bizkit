package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class MemberValidator {
  public boolean isProjectLeader(User user, Long projectId) {
    return true;
  }

  public boolean isProjectMember(User user, Long projectId) {
    return true;
  }

  public boolean isInvitationExists(String invitationId) {
    return true;
  }

  public boolean isCompletedInvitation(String invitationId) {
    return true;
  }

  public boolean isValidInvitation(String invitationId) {
    return true;
  }

  public boolean isProjectFull(String invitationId) {
    return true;
  }

  public boolean isProjectMember(Long userId, Long projectId) {
    return true;
  }
}

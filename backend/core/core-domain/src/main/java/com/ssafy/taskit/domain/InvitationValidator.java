package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class InvitationValidator {

  private final InvitationRepository invitationRepository;

  public InvitationValidator(InvitationRepository invitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  public void isInvitationExists(Long userId) {
    if (!invitationRepository.isInvitationExists(userId)) {
      throw new CoreException(CoreErrorType.INVITATION_EXISTS);
    }
  }

  public void isValidInvitation(String invitationCode) {
    if (!invitationRepository.existsByInvitationCodeAndStatus(invitationCode)) {
      throw new CoreException(CoreErrorType.INVITATION_NOT_VALID);
    }
  }
}

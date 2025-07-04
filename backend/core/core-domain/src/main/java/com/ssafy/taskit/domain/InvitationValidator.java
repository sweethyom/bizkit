package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.util.Objects;
import org.springframework.stereotype.Component;

@Component
public class InvitationValidator {

  private final InvitationRepository invitationRepository;

  public InvitationValidator(InvitationRepository invitationRepository) {
    this.invitationRepository = invitationRepository;
  }

  public void validateInvitationNotExists(Long userId, Long projectId) {
    if (invitationRepository.isInvitationExists(userId, projectId)) {
      throw new CoreException(CoreErrorType.INVITATION_EXISTS);
    }
  }

  public void isValidInvitation(String invitationCode) {
    if (!invitationRepository.existsByInvitationCode(invitationCode)) {
      throw new CoreException(CoreErrorType.INVITATION_NOT_VALID);
    }
  }

  public void isCompletedInvitation(String invitationCode) {
    if (invitationRepository.existsCompletedInvitationByInvitationCode(invitationCode)) {
      throw new CoreException(CoreErrorType.INVITATION_COMPLETED);
    }
  }

  public void isInvitedMember(User user, String invitationCode) {
    if (!Objects.equals(
        invitationRepository.findByInvitationCode(invitationCode).userId(), user.id())) {
      throw new CoreException(CoreErrorType.USER_NOT_INVITED);
    }
  }
}

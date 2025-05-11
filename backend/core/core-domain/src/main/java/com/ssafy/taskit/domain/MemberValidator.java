package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class MemberValidator {

  private final MemberRepository memberRepository;

  public MemberValidator(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }

  public void isProjectLeader(User user, Long projectId) {
    if (!memberRepository.isLeader(user.id(), projectId)) {
      throw new CoreException(CoreErrorType.DATA_NOT_FOUND);
    }
  }

  public void isProjectMember(User user, Long projectId) {
    if (!memberRepository.isMember(user.id(), projectId)) {
      throw new CoreException(CoreErrorType.MEMBER_NOT_FOUND);
    }
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

  public boolean checkProjectLeader(User user, Long projectId) {
    return memberRepository.isLeader(user.id(), projectId);
  }

  public void isProjectMember(Long userId, Long projectId) {
    if (!memberRepository.isMember(userId, projectId)) {
      throw new CoreException(CoreErrorType.MEMBER_NOT_FOUND);
    }
  }
}

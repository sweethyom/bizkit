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

  public boolean isCompletedInvitation(String invitationId) {
    return true;
  }

  public boolean isValidInvitation(String invitationId) {
    return true;
  }

  public void isProjectFull(Long projectId) {
    if (memberRepository.countMembers(projectId) > 30) {
      throw new CoreException(CoreErrorType.PROJECT_IS_FULL);
    }
  }

  public boolean checkProjectLeader(User user, Long projectId) {
    return memberRepository.isLeader(user.id(), projectId);
  }

  public void isProjectMember(Long userId, Long projectId) {
    if (!memberRepository.isMember(userId, projectId)) {
      throw new CoreException(CoreErrorType.MEMBER_NOT_FOUND);
    }
  }

  public void isLeaderAndMemberSame(Long requestUserId, Long targetUserId) {
    if (requestUserId.equals(targetUserId)) {
      throw new CoreException(CoreErrorType.LEADER_MEMBER_SAME_NOT_ALLOWED);
    }
  }
}

package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class MemberDeleter {
  private final MemberRepository memberRepository;
  private final InvitationRepository invitationRepository;
  private final MemberValidator memberValidator;
  private final ProjectValidator projectValidator;
  private final InvitationValidator invitationValidator;

  public MemberDeleter(
      MemberRepository memberRepository,
      InvitationRepository invitationRepository,
      MemberValidator memberValidator,
      ProjectValidator projectValidator,
      InvitationValidator invitationValidator) {
    this.memberRepository = memberRepository;
    this.invitationRepository = invitationRepository;
    this.memberValidator = memberValidator;
    this.projectValidator = projectValidator;
    this.invitationValidator = invitationValidator;
  }

  public void deleteMember(User user, Long memberId) {
    Member member = memberRepository.findById(memberId);
    Long projectId = member.projectId();
    Long memberUserId = member.userId();

    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectLeader(user, projectId);
    memberValidator.validateMember(memberUserId, projectId);
    memberValidator.isLeaderAndMemberSame(user.id(), memberUserId);

    memberRepository.deleteMember(memberId);
  }

  public void leaveProject(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    if (memberValidator.checkProjectLeader(user, projectId)) {
      throw new CoreException(CoreErrorType.LEADER_IS_NOT_ALLOWED);
    }
    memberValidator.validateMember(user.id(), projectId);

    Member member = memberRepository.findByUserIdAndProjectId(user.id(), projectId);
    memberRepository.deleteMember(member.id());
  }

  public void deleteInvitationMember(User user, String invitationCode) {
    Invitation invitation = invitationRepository.findByInvitationCode(invitationCode);
    Long projectId = invitation.projectId();
    memberValidator.isProjectLeader(user, projectId);
    invitationValidator.validateInvitationNotExists(user.id(), projectId);
    invitationValidator.isCompletedInvitation(invitationCode);
    invitationRepository.deleteInvitationMember(invitationCode);
  }
}

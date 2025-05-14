package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
  private final MemberReader memberReader;
  private final MemberValidator memberValidator;
  private final ProjectValidator projectValidator;

  private final MemberDeleter memberDeleter;
  private final MemberAppender memberAppender;

  public MemberService(
      MemberReader memberReader,
      MemberValidator memberValidator,
      ProjectValidator projectValidator,
      MemberDeleter memberDeleter,
      MemberAppender memberAppender) {
    this.memberReader = memberReader;
    this.memberValidator = memberValidator;
    this.projectValidator = projectValidator;
    this.memberDeleter = memberDeleter;
    this.memberAppender = memberAppender;
  }

  public List<Member> findMembers(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectMember(user, projectId);
    return memberReader.findMembers(projectId);
  }

  public Member findMember(Long memberId) {
    return memberReader.findMember(memberId);
  }

  public void deleteMember(User user, Long memberId) {
    memberDeleter.deleteMember(user, memberId);
  }

  public void leaveProject(User user, Long projectId) {
    memberDeleter.leaveProject(user, projectId);
  }

  public String appendInvitation(User user, Long projectId, NewInvitation newInvitation) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectLeader(user, projectId);
    Invitation invitation = memberAppender.appendInvitation(projectId, newInvitation);
    return invitation.invitationCode();
  }
}

package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class MemberDeleter {
  private final MemberRepository memberRepository;
  private final MemberValidator memberValidator;
  private final ProjectValidator projectValidator;

  public MemberDeleter(
      MemberRepository memberRepository,
      MemberValidator memberValidator,
      ProjectValidator projectValidator) {
    this.memberRepository = memberRepository;
    this.memberValidator = memberValidator;
    this.projectValidator = projectValidator;
  }

  public void deleteMember(User user, Long memberId) {
    Member member = memberRepository.findById(memberId);
    Long projectId = member.projectId();
    Long memberUserId = member.userId();

    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectLeader(user, projectId);
    memberValidator.isProjectMember(memberUserId, projectId);
    memberValidator.isLeaderAndMemberSame(user.id(), memberUserId);

    memberRepository.deleteMember(memberId);
  }
}

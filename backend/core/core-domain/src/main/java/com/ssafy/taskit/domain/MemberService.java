package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
  private final MemberReader memberReader;
  private final MemberValidator memberValidator;
  private final ProjectValidator projectValidator;

  private final MemberDeleter memberDeleter;

  public MemberService(
      MemberReader memberReader,
      MemberValidator memberValidator,
      ProjectValidator projectValidator,
      MemberDeleter memberDeleter) {
    this.memberReader = memberReader;
    this.memberValidator = memberValidator;
    this.projectValidator = projectValidator;
    this.memberDeleter = memberDeleter;
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
}

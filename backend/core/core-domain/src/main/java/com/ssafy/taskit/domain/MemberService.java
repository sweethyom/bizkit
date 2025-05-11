package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
  private final MemberReader memberReader;
  private final MemberValidator memberValidator;
  private final ProjectValidator projectValidator;

  public MemberService(
      MemberReader memberReader,
      MemberValidator memberValidator,
      ProjectValidator projectValidator) {
    this.memberReader = memberReader;
    this.memberValidator = memberValidator;
    this.projectValidator = projectValidator;
  }

  public List<Member> findMembers(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectMember(user, projectId);
    return memberReader.findMembers(projectId);
  }
}

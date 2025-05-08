package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class IssueAppender {

  private final EpicValidator epicValidator;
  private final MemberValidator memberValidator;
  private final IssueRepository issueRepository;
  private final EpicRepository epicRepository;

  public IssueAppender(
      EpicValidator epicValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
  }

  public Issue append(User user, Long epicId, NewIssue newIssue) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.isProjectMember(user, epic.projectId());
    // TODO: 키 업데이트 추후 구현
    String key = "PROJECT-2";
    return issueRepository.save(epicId, newIssue, key);
  }
}

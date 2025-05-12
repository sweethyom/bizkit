package com.ssafy.taskit.domain;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

@Component
public class IssueAppender {

  private final EpicValidator epicValidator;
  private final MemberValidator memberValidator;
  private final IssueRepository issueRepository;
  private final EpicRepository epicRepository;
  private final KeyGenerator keyGenerator;

  public IssueAppender(
      EpicValidator epicValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository,
      KeyGenerator keyGenerator) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
    this.keyGenerator = keyGenerator;
  }

  @Transactional
  public Issue append(User user, Long epicId, NewIssue newIssue) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.isProjectMember(user, epic.projectId());
    String key = keyGenerator.generateKey(epic.projectId());
    return issueRepository.save(epicId, newIssue, key);
  }
}

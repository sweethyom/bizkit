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

  private final IssueModifier issueModifier;

  public IssueAppender(
      EpicValidator epicValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository,
      KeyGenerator keyGenerator,
      IssueModifier issueModifier) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
    this.keyGenerator = keyGenerator;
    this.issueModifier = issueModifier;
  }

  @Transactional
  public Issue append(User user, Long epicId, NewIssue newIssue) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.validateMember(user, epic.projectId());
    String key = keyGenerator.generateKey(epic.projectId());
    Issue issue = issueRepository.save(epicId, newIssue, key);

    issueModifier.modifyIssuePosition(issue.id(), issue.id() * 100.0);
    issue = issueRepository.findById(issue.id());

    return issue;
  }
}

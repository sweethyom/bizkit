package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class IssueDeleter {

  private final IssueValidator issueValidator;
  private final MemberValidator memberValidator;
  private final IssueRepository issueRepository;
  private final EpicRepository epicRepository;

  public IssueDeleter(
      IssueValidator issueValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository) {
    this.issueValidator = issueValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
  }

  public void deleteIssue(User user, Long issueId) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.isProjectMember(user, epic.projectId());
    issueRepository.delete(issueId);
  }
}

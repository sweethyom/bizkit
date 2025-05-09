package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class IssueModifier {

  private final IssueValidator issueValidator;
  private final MemberValidator memberValidator;
  private final IssueRepository issueRepository;
  private final EpicRepository epicRepository;

  public IssueModifier(
      IssueValidator issueValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository) {
    this.issueValidator = issueValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
  }

  public void modifyIssueName(User user, Long issueId, ModifyIssueName modifyIssueName) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.isProjectMember(user, epic.projectId());
    issueRepository.modifyIssueName(issueId, modifyIssueName);
  }

  public void modifyIssueContent(User user, Long issueId, ModifyIssueContent modifyIssueContent) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.isProjectMember(user, epic.projectId());
    issueRepository.modifyIssueContent(issueId, modifyIssueContent);
  }
}

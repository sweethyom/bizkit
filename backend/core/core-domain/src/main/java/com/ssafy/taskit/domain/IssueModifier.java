package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class IssueModifier {

  private final IssueValidator issueValidator;
  private final MemberValidator memberValidator;
  private final IssueRepository issueRepository;
  private final EpicRepository epicRepository;
  private final ComponentValidator componentValidator;
  private final SprintValidator sprintValidator;
  private final EpicValidator epicValidator;

  public IssueModifier(
      IssueValidator issueValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository,
      ComponentValidator componentValidator,
      SprintValidator sprintValidator,
      EpicValidator epicValidator) {
    this.issueValidator = issueValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
    this.componentValidator = componentValidator;
    this.sprintValidator = sprintValidator;
    this.epicValidator = epicValidator;
  }

  public void modifyIssueName(User user, Long issueId, ModifyIssueName modifyIssueName) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    issueRepository.modifyIssueName(issueId, modifyIssueName);
  }

  public void modifyIssueContent(User user, Long issueId, ModifyIssueContent modifyIssueContent) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    issueRepository.modifyIssueContent(issueId, modifyIssueContent);
  }

  public void modifyIssueAssignee(
      User user, Long issueId, ModifyIssueAssignee modifyIssueAssignee) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    memberValidator.validateNotMember(modifyIssueAssignee.assigneeId(), epic.projectId());
    issueRepository.modifyIssueAssignee(issueId, modifyIssueAssignee);
  }

  public void modifyIssueComponent(
      User user, Long issueId, ModifyIssueComponent modifyIssueComponent) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    componentValidator.isComponentInProject(modifyIssueComponent.componentId(), epic.projectId());
    issueRepository.modifyIssueComponent(issueId, modifyIssueComponent);
  }

  public void modifyIssueBizpoint(
      User user, Long issueId, ModifyIssueBizpoint modifyIssueBizpoint) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    issueRepository.modifyIssueBizpoint(issueId, modifyIssueBizpoint);
  }

  public void modifyIssueImportance(
      User user, Long issueId, ModifyIssueImportance modifyIssueImportance) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    issueRepository.modifyIssueImportance(issueId, modifyIssueImportance);
  }

  public void modifyIssueStatus(User user, Long issueId, ModifyIssueStatus modifyIssueStatus) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    sprintValidator.isOngoingSprint(issue.sprintId());
    issueRepository.modifyIssueStatus(issueId, modifyIssueStatus);
  }

  public void modifyIssueEpic(User user, Long issueId, ModifyIssueEpic modifyIssueEpic) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    epicValidator.isEpicInProject(modifyIssueEpic.epicId(), epic.projectId());
    issueRepository.modifyIssueEpic(issueId, modifyIssueEpic);
  }

  public void modifyIssueSprint(User user, Long issueId, ModifyIssueSprint modifyIssueSprint) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateNotMember(user, epic.projectId());
    sprintValidator.isCompletedSprint(issue.sprintId());
    sprintValidator.isSprintExists(modifyIssueSprint.targetId());
    sprintValidator.isSprintsEquals(issue.sprintId(), modifyIssueSprint.targetId());
    sprintValidator.isSprintsInSameProject(issue.sprintId(), modifyIssueSprint.targetId());
    issueRepository.modifyIssueSprint(issueId, modifyIssueSprint);
  }
}

package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
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
    memberValidator.validateMember(user, epic.projectId());
    issueRepository.modifyIssueName(issueId, modifyIssueName);
  }

  public void modifyIssueContent(User user, Long issueId, ModifyIssueContent modifyIssueContent) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    issueRepository.modifyIssueContent(issueId, modifyIssueContent);
  }

  public void modifyIssueAssignee(
      User user, Long issueId, ModifyIssueAssignee modifyIssueAssignee) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    memberValidator.validateMember(modifyIssueAssignee.assigneeId(), epic.projectId());
    issueRepository.modifyIssueAssignee(issueId, modifyIssueAssignee);
  }

  public void modifyIssueComponent(
      User user, Long issueId, ModifyIssueComponent modifyIssueComponent) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    if (modifyIssueComponent.componentId() != null) {
      componentValidator.isComponentInProject(modifyIssueComponent.componentId(), epic.projectId());
    }
    issueRepository.modifyIssueComponent(issueId, modifyIssueComponent);
  }

  public void modifyIssueBizpoint(
      User user, Long issueId, ModifyIssueBizpoint modifyIssueBizpoint) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    issueRepository.modifyIssueBizpoint(issueId, modifyIssueBizpoint);
  }

  public void modifyIssueImportance(
      User user, Long issueId, ModifyIssueImportance modifyIssueImportance) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    issueRepository.modifyIssueImportance(issueId, modifyIssueImportance);
  }

  public void modifyIssueStatus(User user, Long issueId, ModifyIssueStatus modifyIssueStatus) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    sprintValidator.isOngoingSprint(issue.sprintId());
    issueRepository.modifyIssueStatus(issueId, modifyIssueStatus);
  }

  public void modifyIssueEpic(User user, Long issueId, ModifyIssueEpic modifyIssueEpic) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    epicValidator.isEpicInProject(modifyIssueEpic.epicId(), epic.projectId());
    issueRepository.modifyIssueEpic(issueId, modifyIssueEpic);
  }

  public void modifyIssueSprint(User user, Long issueId, ModifyIssueSprint modifyIssueSprint) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    Long currentSprintId = issue.sprintId();
    Long targetSprintId = modifyIssueSprint.targetId();

    if (currentSprintId != null && targetSprintId == 0L) {
      // 조건 1: 기존 스프린트 → 백로그 이동
      sprintValidator.isCompletedSprint(currentSprintId);
      issueRepository.modifyIssueSprintToBacklog(issueId);
      return;
    }

    if (currentSprintId != null && targetSprintId != 0L) {
      // 조건 2: 기존 스프린트 → 다른 스프린트 이동
      sprintValidator.isCompletedSprint(currentSprintId);
      sprintValidator.isSprintsEquals(currentSprintId, targetSprintId);
      sprintValidator.isSprintsInSameProject(currentSprintId, targetSprintId);
      sprintValidator.isSprintExists(targetSprintId);
      issueRepository.modifyIssueSprint(issueId, modifyIssueSprint);
      return;
    }

    if (currentSprintId == null && targetSprintId != 0L) {
      // 조건 3: 백로그 상태 → 스프린트 할당
      sprintValidator.isSprintExists(targetSprintId);
      issueRepository.modifyIssueSprint(issueId, modifyIssueSprint);
      return;
    }

    if (currentSprintId == null && targetSprintId == 0L) {
      // 조건 4: 백로그 상태에서 또 백로그 → 예외
      throw new CoreException(CoreErrorType.ISSUE_ALREADY_IN_BACKLOG);
    }
  }
}

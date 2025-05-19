package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class SprintMover {

  private final IssueReader issueReader;
  private final SprintValidator sprintValidator;
  private final MemberValidator memberValidator;
  private final IssueModifier issueModifier;

  private final SprintReader sprintReader;

  public SprintMover(
      IssueReader issueReader,
      SprintValidator sprintValidator,
      MemberValidator memberValidator,
      IssueModifier issueModifier,
      SprintReader sprintReader) {
    this.issueReader = issueReader;
    this.sprintValidator = sprintValidator;
    this.memberValidator = memberValidator;
    this.issueModifier = issueModifier;
    this.sprintReader = sprintReader;
  }

  public void moveSprintIssue(User user, Long sprintId, MoveSprintIssue moveSprintIssue) {
    Issue issue = issueReader.readIssue(user, moveSprintIssue.issueId());

    if (!issue.sprintId().equals(sprintId)) {
      throw new CoreException(CoreErrorType.MOVE_ISSUE_NOT_IN_THIS_SPRINT);
    }
    sprintValidator.isOngoingSprint(issue.sprintId());
    Sprint sprint = sprintReader.findSprint(issue.sprintId());
    memberValidator.validateMember(user, sprint.projectId());

    IssueMoveDecisioner decision = IssueMoveDecisioner.of(issue, moveSprintIssue);
    IssueMoveOption moveOption = decision.toMoveType();

    switch (moveOption) {
      case STATUS_ONLY -> issueModifier.modifyIssueStatus(
          user, moveSprintIssue.issueId(), new ModifyIssueStatus(moveSprintIssue.issueStatus()));

      case COMPONENT_ONLY -> issueModifier.modifyIssueComponent(
          user, moveSprintIssue.issueId(), new ModifyIssueComponent(moveSprintIssue.componentId()));

      case STATUS_AND_COMPONENT -> {
        issueModifier.modifyIssueStatus(
            user, moveSprintIssue.issueId(), new ModifyIssueStatus(moveSprintIssue.issueStatus()));
        issueModifier.modifyIssueComponent(
            user,
            moveSprintIssue.issueId(),
            new ModifyIssueComponent(moveSprintIssue.componentId()));
      }

      case NO_CHANGE -> {
        return;
      }
    }
  }
}

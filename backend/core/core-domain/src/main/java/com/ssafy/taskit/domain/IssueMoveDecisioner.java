package com.ssafy.taskit.domain;

public record IssueMoveDecisioner(boolean componentChanged, boolean statusChanged) {
  public static IssueMoveDecisioner of(Issue issue, MoveSprintIssue move) {
    boolean componentChanged =
        move.componentId() != null && !move.componentId().equals(issue.componentId());

    boolean statusChanged =
        move.issueStatus() != null && !move.issueStatus().equals(issue.issueStatus());

    return new IssueMoveDecisioner(componentChanged, statusChanged);
  }

  public IssueMoveOption toMoveType() {
    return IssueMoveOption.from(componentChanged, statusChanged);
  }
}

package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.MoveSprintIssue;

public record MoveSprintIssueRequest(Long moveIssueId, Long componentId, IssueStatus status) {

  public MoveSprintIssue toMoveSprintIssue() {
    return new MoveSprintIssue(this.moveIssueId, this.componentId, this.status);
  }
}

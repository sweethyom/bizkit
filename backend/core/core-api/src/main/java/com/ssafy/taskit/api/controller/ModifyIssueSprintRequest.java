package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.ModifyIssueSprint;

public record ModifyIssueSprintRequest(Long targetId) {
  public ModifyIssueSprint toModifyIssueSprint() {
    return new ModifyIssueSprint(this.targetId);
  }
}

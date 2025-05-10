package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.ModifyIssueSprint;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueSprintRequest(@NotNull Long targetId) {
  public ModifyIssueSprint toModifyIssueSprint() {
    return new ModifyIssueSprint(this.targetId);
  }
}

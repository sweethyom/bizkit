package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.ModifyIssueAssignee;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueAssigneeRequest(@NotNull Long assigneeId) {
  public ModifyIssueAssignee toModifyIssueAssignee() {
    return new ModifyIssueAssignee(this.assigneeId);
  }
}

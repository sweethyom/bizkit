package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.ModifyIssueStatus;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueStatusRequest(@NotNull IssueStatus issueStatus) {
  public ModifyIssueStatus toModifyIssueStatus() {
    return new ModifyIssueStatus(this.issueStatus);
  }
}

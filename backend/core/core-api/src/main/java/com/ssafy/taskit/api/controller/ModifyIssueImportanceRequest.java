package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.ModifyIssueImportance;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueImportanceRequest(@NotNull Importance issueImportance) {
  public ModifyIssueImportance toModifyIssueImportance() {
    return new ModifyIssueImportance(this.issueImportance);
  }
}

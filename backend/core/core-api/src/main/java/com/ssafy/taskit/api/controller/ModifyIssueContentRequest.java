package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.IssueContent;
import com.ssafy.taskit.domain.ModifyIssueContent;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueContentRequest(@NotNull @IssueContent String content) {
  public ModifyIssueContent toModifyIssueContent() {
    return new ModifyIssueContent(this.content);
  }
}

package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.ModifyIssueComponent;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueComponentRequest(@NotNull Long componentId) {
  public ModifyIssueComponent toModifyIssueComponent() {
    return new ModifyIssueComponent(this.componentId);
  }
}

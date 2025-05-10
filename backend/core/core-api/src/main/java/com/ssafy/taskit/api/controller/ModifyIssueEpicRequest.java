package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.ModifyIssueEpic;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueEpicRequest(@NotNull Long epicId) {
  public ModifyIssueEpic toModifyIssueEpic() {
    return new ModifyIssueEpic(this.epicId);
  }
}

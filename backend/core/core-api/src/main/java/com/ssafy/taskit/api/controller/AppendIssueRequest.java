package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.IssueName;
import com.ssafy.taskit.domain.NewIssue;
import jakarta.validation.constraints.NotNull;

public record AppendIssueRequest(@NotNull @IssueName String name) {
  public NewIssue toNewIssue() {
    return new NewIssue(this.name());
  }
}

package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.IssueName;
import com.ssafy.taskit.domain.ModifyIssueName;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueNameRequest(@NotNull @IssueName String name) {
  public ModifyIssueName toModifyIssueName() {
    return new ModifyIssueName(this.name);
  }
}

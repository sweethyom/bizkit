package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.SprintName;
import com.ssafy.taskit.domain.ModifySprintName;
import jakarta.validation.constraints.NotBlank;

public record ModifySprintNameRequest(@NotBlank @SprintName String name) {

  public ModifySprintName toModifySprintName() {
    return new ModifySprintName(this.name);
  }
}

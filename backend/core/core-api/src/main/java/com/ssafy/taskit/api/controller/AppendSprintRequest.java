package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.SprintName;
import com.ssafy.taskit.domain.NewSprint;
import jakarta.validation.constraints.NotBlank;

public record AppendSprintRequest(@NotBlank @SprintName String name) {

  public NewSprint toNewSprint() {
    return new NewSprint(this.name);
  }
}

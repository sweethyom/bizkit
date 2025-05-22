package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.ModifySprintDueDate;
import java.time.LocalDate;

public record ModifySprintDueDateRequest(LocalDate dueDate) {

  public ModifySprintDueDate toModifySprintDueDate() {
    return new ModifySprintDueDate(this.dueDate);
  }
}

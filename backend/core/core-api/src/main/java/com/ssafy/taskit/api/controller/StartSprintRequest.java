package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.StartSprint;
import java.time.LocalDate;

public record StartSprintRequest(LocalDate dueDate) {

  public StartSprint toStartSprint() {
    return new StartSprint(this.dueDate);
  }
}

package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintStatus;

public record SprintResponse(Long id, String name, SprintStatus sprintStatus) {
  public static SprintResponse from(Sprint sprint) {
    return new SprintResponse(sprint.id(), sprint.name(), sprint.sprintStatus());
  }
}

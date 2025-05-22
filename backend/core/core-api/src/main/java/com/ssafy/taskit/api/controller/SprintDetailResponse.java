package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintStatus;
import java.time.LocalDate;
import java.util.List;

public record SprintDetailResponse(
    Long id,
    String name,
    SprintStatus sprintStatus,
    LocalDate startDate,
    LocalDate dueDate,
    LocalDate completedDate) {

  public static List<SprintDetailResponse> of(List<Sprint> sprints) {
    return sprints.stream()
        .map(sprint -> new SprintDetailResponse(
            sprint.id(),
            sprint.name(),
            sprint.sprintStatus(),
            sprint.startDate(),
            sprint.dueDate(),
            sprint.completedDate()))
        .toList();
  }
}

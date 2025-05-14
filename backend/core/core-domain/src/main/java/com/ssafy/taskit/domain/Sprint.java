package com.ssafy.taskit.domain;

import java.time.LocalDate;

public record Sprint(
    Long id,
    String name,
    SprintStatus sprintStatus,
    LocalDate startDate,
    LocalDate dueDate,
    LocalDate completedDate,
    Long projectId) {}

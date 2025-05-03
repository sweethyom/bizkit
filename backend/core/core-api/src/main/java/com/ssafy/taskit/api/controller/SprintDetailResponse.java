package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.SprintStatus;
import java.time.LocalDate;

public record SprintDetailResponse(
    Long id,
    String name,
    SprintStatus status,
    LocalDate startDate,
    LocalDate dueDate,
    LocalDate completedDate) {}

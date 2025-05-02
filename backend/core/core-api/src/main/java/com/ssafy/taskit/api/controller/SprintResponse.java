package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.SprintStatus;

public record SprintResponse(Long id, String name, SprintStatus sprintStatus) {}

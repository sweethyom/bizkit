package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.ProjectName;
import jakarta.validation.constraints.NotNull;

public record ModifyProjectNameRequest(@NotNull @ProjectName String name) {}

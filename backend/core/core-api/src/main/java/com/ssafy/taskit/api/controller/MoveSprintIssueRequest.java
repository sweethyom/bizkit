package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.IssueStatus;

public record MoveSprintIssueRequest(
    Long moveIssueId, Long preIssueId, Long componentId, IssueStatus status) {}

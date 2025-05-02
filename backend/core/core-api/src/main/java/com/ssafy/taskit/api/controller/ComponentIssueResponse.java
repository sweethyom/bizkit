package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Importance;

public record ComponentIssueResponse(
    Long id,
    String name,
    String key,
    Long bizPoint,
    Importance issueImportance,
    ComponentResponse component,
    AssigneeResponse assignee,
    IssueDetailEpicResponse epic) {}

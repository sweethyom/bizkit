package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.IssueStatus;

public record EpicIssuesResponse(
    Long id,
    String name,
    String key,
    Long bizPoint,
    Importance issueImportance,
    IssueStatus issueStatus,
    ComponentResponse component,
    AssigneeResponse assignee) {}

package com.ssafy.taskit.domain;

public record MoveSprintIssue(
    Long issueId,
    Long componentId,
    IssueStatus issueStatus,
    Double beforeIssuePosition,
    Double afterIssuePosition) {}

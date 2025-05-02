package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Importance;

public record MyIssuesResponse(
    Long id,
    String name,
    String key,
    Importance importance,
    IssueDetailEpicResponse epic,
    MyIssuesProjectResponse project) {}

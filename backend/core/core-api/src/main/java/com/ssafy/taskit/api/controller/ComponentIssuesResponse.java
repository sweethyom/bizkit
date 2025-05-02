package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.IssueStatus;
import java.util.List;

public record ComponentIssuesResponse(
    IssueStatus issueStatus, List<ComponentIssueResponse> issues) {}

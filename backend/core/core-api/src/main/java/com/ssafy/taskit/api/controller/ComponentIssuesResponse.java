package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.UserDetail;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record ComponentIssuesResponse(
    IssueStatus issueStatus, List<ComponentIssueResponse> issues) {
  public static List<ComponentIssuesResponse> of(
      List<Issue> issues,
      Map<Long, Component> componentMap,
      Map<Long, UserDetail> userMap,
      Map<Long, Epic> epicMap) {
    return issues.stream()
        .collect(Collectors.groupingBy(Issue::issueStatus)) // IssueStatus별 그룹핑
        .entrySet()
        .stream()
        .map(entry -> new ComponentIssuesResponse(
            entry.getKey(),
            ComponentIssueResponse.of(entry.getValue(), componentMap, userMap, epicMap)))
        .toList();
  }
}

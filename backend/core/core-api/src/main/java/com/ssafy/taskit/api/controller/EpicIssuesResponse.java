package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Assignee;
import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueStatus;
import java.util.List;
import java.util.Map;

public record EpicIssuesResponse(
    Long id,
    String name,
    String key,
    Long bizPoint,
    Importance issueImportance,
    IssueStatus issueStatus,
    ComponentResponse component,
    AssigneeResponse assignee) {

  public static List<EpicIssuesResponse> of(
      List<Issue> issues, Map<Long, Component> componentMap, Map<Long, Assignee> assigneeMap) {
    return issues.stream()
        .map(issue -> {
          Component component =
              componentMap.getOrDefault(issue.componentId(), new Component(0L, 0L, 0L, "", ""));
          Assignee assignee =
              assigneeMap.getOrDefault(issue.assigneeId(), new Assignee(0L, "", ""));

          return new EpicIssuesResponse(
              issue.id(),
              issue.name(),
              issue.key(),
              issue.bizPoint(),
              issue.issueImportance(),
              issue.issueStatus(),
              new ComponentResponse(component.id(), component.name()),
              new AssigneeResponse(assignee.id(), assignee.nickname(), assignee.profileImageUrl()));
        })
        .toList();
  }
}

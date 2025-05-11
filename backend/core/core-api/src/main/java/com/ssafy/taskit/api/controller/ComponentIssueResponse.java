package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Assignee;
import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record ComponentIssueResponse(
    Long id,
    String name,
    String key,
    Long bizPoint,
    Importance issueImportance,
    ComponentResponse component,
    AssigneeResponse assignee,
    IssueDetailEpicResponse epic) {
  public static List<ComponentIssueResponse> of(
      List<Issue> issues,
      Map<Long, Component> componentMap,
      Map<Long, Assignee> assigneeMap,
      Map<Long, Epic> epicMap) {
    return issues.stream()
        .map(issue -> {
          Component component =
              componentMap.getOrDefault(issue.componentId(), new Component(0L, 0L, 0L, "", ""));
          Assignee assignee =
              assigneeMap.getOrDefault(issue.assigneeId(), new Assignee(0L, "", ""));
          Epic epic = epicMap.getOrDefault(
              issue.epicId(),
              new Epic(
                  0L, "", "", 0L, new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())));

          return new ComponentIssueResponse(
              issue.id(),
              issue.name(),
              issue.key(),
              issue.bizPoint(),
              issue.issueImportance(),
              new ComponentResponse(component.id(), component.name()),
              new AssigneeResponse(assignee.id(), assignee.nickname(), assignee.profileImageUrl()),
              new IssueDetailEpicResponse(epic.id(), epic.name(), epic.key()));
        })
        .toList();
  }
}

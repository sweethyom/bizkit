package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.UserDetail;
import java.util.List;
import java.util.Map;

public record ComponentIssueResponse(
    Long id,
    String name,
    String key,
    Long bizPoint,
    Importance issueImportance,
    Double position,
    ComponentResponse component,
    UserProfileResponse user,
    IssueDetailEpicResponse epic) {
  public static List<ComponentIssueResponse> of(
      List<Issue> issues,
      Map<Long, Component> componentMap,
      Map<Long, UserDetail> userMap,
      Map<Long, Epic> epicMap) {
    return issues.stream()
        .map(issue -> {
          Component component = componentMap.getOrDefault(issue.componentId(), Component.empty());
          UserDetail user = userMap.getOrDefault(issue.assigneeId(), UserDetail.empty());
          Epic epic = epicMap.getOrDefault(issue.epicId(), Epic.empty());

          return new ComponentIssueResponse(
              issue.id(),
              issue.name(),
              issue.key(),
              issue.bizPoint(),
              issue.issueImportance(),
              issue.position(),
              new ComponentResponse(component.id(), component.name()),
              new UserProfileResponse(user.id(), user.nickname(), user.profileImgUrl()),
              new IssueDetailEpicResponse(epic.id(), epic.name(), epic.key()));
        })
        .toList();
  }
}

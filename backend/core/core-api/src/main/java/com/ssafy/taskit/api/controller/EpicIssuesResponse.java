package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.UserDetail;
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
    UserProfileResponse user) {

  public static List<EpicIssuesResponse> of(
      List<Issue> issues, Map<Long, Component> componentMap, Map<Long, UserDetail> userMap) {
    return issues.stream()
        .map(issue -> {
          Component component =
              componentMap.getOrDefault(issue.componentId(), new Component(0L, 0L, 0L, "", ""));
          UserDetail user =
              userMap.getOrDefault(issue.assigneeId(), new UserDetail(0L, "", "", ""));

          return new EpicIssuesResponse(
              issue.id(),
              issue.name(),
              issue.key(),
              issue.bizPoint(),
              issue.issueImportance(),
              issue.issueStatus(),
              new ComponentResponse(component.id(), component.name()),
              new UserProfileResponse(user.id(), user.nickname(), user.profileImgUrl()));
        })
        .toList();
  }
}

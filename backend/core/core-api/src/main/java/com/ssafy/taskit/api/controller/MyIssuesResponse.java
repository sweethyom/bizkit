package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record MyIssuesResponse(
    Long id,
    String name,
    String key,
    Importance issueImportance,
    IssueDetailEpicResponse epic,
    MyIssuesProjectResponse project) {
  public static List<MyIssuesResponse> of(
      List<Issue> issues, Map<Long, Epic> epicMap, Map<Long, Project> projectMap) {
    return issues.stream()
        .map(issue -> {
          Epic epic = epicMap.getOrDefault(
              issue.epicId(),
              new Epic(
                  0L, "", "", 0L, new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())));
          Project project = projectMap.getOrDefault(
              epic.projectId(),
              new Project(
                  0L,
                  0L,
                  "",
                  "",
                  0,
                  "",
                  new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())));

          return new MyIssuesResponse(
              issue.id(),
              issue.name(),
              issue.key(),
              issue.issueImportance(),
              new IssueDetailEpicResponse(epic.id(), epic.name(), epic.key()),
              new MyIssuesProjectResponse(project.id(), project.name()));
        })
        .toList();
  }
}

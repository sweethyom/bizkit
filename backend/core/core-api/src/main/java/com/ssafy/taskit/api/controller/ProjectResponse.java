package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Project;
import java.util.List;
import java.util.Map;

public record ProjectResponse(Long id, String name, String image, int todoCount) {

  public static ProjectResponse from(Project project, Map<Long, Integer> todoCountMap) {
    return new ProjectResponse(
        project.id(), project.name(), project.image(), todoCountMap.getOrDefault(project.id(), 0));
  }

  public static List<ProjectResponse> of(List<Project> projects, Map<Long, Integer> todoCountMap) {
    return projects.stream().map(project -> from(project, todoCountMap)).toList();
  }

  public static ProjectResponse from(Project project) {
    return new ProjectResponse(project.id(), project.name(), project.image(), 0);
  }

  public static List<ProjectResponse> of(List<Project> projects) {
    return projects.stream().map(ProjectResponse::from).toList();
  }
}

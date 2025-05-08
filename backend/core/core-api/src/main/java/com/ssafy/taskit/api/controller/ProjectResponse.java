package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Project;
import java.util.List;

public record ProjectResponse(Long id, String name, String image, int todoCount) {

  public static ProjectResponse from(Project project) {
    return new ProjectResponse(
        project.getId(), project.getName(), project.getImage(), 0 // 임시로 0 설정
        );
  }

  public static List<ProjectResponse> of(List<Project> projects) {
    return projects.stream().map(ProjectResponse::from).toList();
  }
}

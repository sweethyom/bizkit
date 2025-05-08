package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Project;
import java.util.List;

public record ProjectResponse(Long id, String name, String image, int todoCount) {

  //  public static List<ProjectResponse> of(List<Project> projects,  List<Object[]> issueCounts) {
  //    Map<Long, Integer> issueCountMap = issueCounts.stream()
  //            .collect(Collectors.toMap(
  //                    arr -> (Long) arr[0],
  //                    arr -> ((Number) arr[1]).intValue()
  //            ));
  //
  //    return projects.stream()
  //            .map(project -> new ProjectResponse(
  //                    project.getId(),
  //                    project.getName(),
  //                    project.getImage(),
  //                    issueCountMap.getOrDefault(project.getId(), 0)
  //            ))
  //            .toList();
  //  }
  public static ProjectResponse from(Project project) {
    return new ProjectResponse(
        project.getId(), project.getName(), project.getImage(), 0 // 임시로 0 설정
        );
  }

  public static List<ProjectResponse> of(List<Project> projects) {
    return projects.stream().map(ProjectResponse::from).toList();
  }
}

package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.UserDetail;

public record ProjectSummaryResponse(
    Long id, String name, String image, UserProfileResponse leader) {
  public static ProjectSummaryResponse of(Project project, UserDetail userDetail) {
    return new ProjectSummaryResponse(
        project.getId(), project.getName(), project.getImage(), UserProfileResponse.of(userDetail));
  }
}

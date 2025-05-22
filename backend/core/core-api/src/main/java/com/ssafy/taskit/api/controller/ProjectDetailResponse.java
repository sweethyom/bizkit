package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.ProjectDetail;

public record ProjectDetailResponse(
    Long id, String name, String key, String image, boolean leader) {
  public static ProjectDetailResponse of(ProjectDetail projectDetail) {
    return new ProjectDetailResponse(
        projectDetail.project().id(),
        projectDetail.project().name(),
        projectDetail.project().key(),
        projectDetail.project().image(),
        projectDetail.isLeader());
  }
}

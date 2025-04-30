package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProjectController {
  @PostMapping("/projects")
  public ApiResponse<DefaultIdResponse> appendProject(@RequestBody AppendProjectRequest request) {
    DefaultIdResponse response = new DefaultIdResponse(1L);
    return ApiResponse.success(response);
  }

  @GetMapping("/projects")
  public ApiResponse<List<ProjectResponse>> findProjects(
      @RequestParam(required = false) Long cursor) {
    List<ProjectResponse> response = List.of(
        new ProjectResponse(1L, "프로젝트 이름1", "default1.jpg", 4),
        new ProjectResponse(2L, "프로젝트 이름2", "default2.jpg", 3),
        new ProjectResponse(3L, "프로젝트 이름3", "default3.jpg", 2));
    return ApiResponse.success(response);
  }

  @GetMapping("/projects/{projectId}")
  public ApiResponse<ProjectDetailResponse> findProject(@PathVariable Long projectId) {
    ProjectDetailResponse response =
        new ProjectDetailResponse(1L, "프로젝트 이름1", "default1.jpg", true);
    return ApiResponse.success(response);
  }

  @PatchMapping("/projects/{projectId}")
  public ApiResponse<Void> modifyProjectName(
      @PathVariable Long projectId, @RequestBody ModifyProjectNameRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("/projects/{projectId}/image")
  public ApiResponse<Void> modifyProjectImage(
      @PathVariable Long projectId, @RequestBody ModifyProjectImageRequest request) {
    return ApiResponse.success();
  }

  @DeleteMapping("/projects/{projectId}")
  public ApiResponse<Void> deleteProject(@PathVariable Long projectId) {
    return ApiResponse.success();
  }

  @GetMapping("/projects/{projectId}/invitation")
  public ApiResponse<InvitationProjectResponse> findInvitationProject(
      @PathVariable Long projectId) {
    LeaderResponse leaderResponse = new LeaderResponse(1L, "팀장1", "profile1.jpg");
    InvitationProjectResponse response =
        new InvitationProjectResponse(1L, "프로젝트 이름1", "default1.jpg", leaderResponse);
    return ApiResponse.success(response);
  }
}

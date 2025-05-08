package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.*;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProjectController {
  private final ProjectService projectService;

  public ProjectController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @PostMapping("/projects")
  public ApiResponse<DefaultIdResponse> appendProject(
      ApiUser apiUser, @RequestPart AppendProjectRequest request) {
    NewProject newProject = request.toNewProject();

    Long id = projectService.append(apiUser.toUser(), newProject);
    return ApiResponse.success(new DefaultIdResponse(id));
  }

  @GetMapping("/projects")
  public ApiResponse<List<ProjectResponse>> findProjects(
      ApiUser apiUser, @RequestParam(required = false) Long cursor) {
    List<Project> projects = projectService.findProjects(apiUser.toUser());
    //    Map<Long, Integer> todoCountMap = todoCountProvider.getTodoCountsByProjectIds(
    //            projectIds, apiUser.toUser().id());
    return ApiResponse.success(ProjectResponse.of(projects));
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

  @GetMapping("/projects/invitation/{invitationId}")
  public ApiResponse<ProjectSummaryResponse> findInvitationProject(
      @PathVariable Long invitationId) {
    UserProfileResponse leaderResponse = new UserProfileResponse(1L, "팀장1", "profile1.jpg");
    ProjectSummaryResponse response =
        new ProjectSummaryResponse(1L, "프로젝트 이름1", "default1.jpg", leaderResponse);
    return ApiResponse.success(response);
  }
}

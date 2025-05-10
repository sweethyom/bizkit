package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.controller.support.FileConverter;
import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.*;
import com.ssafy.taskit.domain.image.File;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ProjectController {
  private final ProjectService projectService;
  private final ProjectImageFacade projectImageFacade;
  private final UserService userService;

  public ProjectController(ProjectService projectService, ProjectImageFacade projectImageFacade,  UserService userService) {
    this.projectService = projectService;
    this.userService = userService;
    this.projectImageFacade = projectImageFacade;
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
      ApiUser apiUser,
      @RequestParam(required = false) Long cursor,
      @RequestParam(required = false, defaultValue = "RECENT_VIEW") ProjectSort sort) {
    List<Project> projects = projectService.findProjects(apiUser.toUser(), sort);
    return ApiResponse.success(ProjectResponse.of(projects));
  }

  @GetMapping("/projects/{projectId}")
  public ApiResponse<ProjectDetailResponse> findProject(
      ApiUser apiUser, @PathVariable Long projectId) {
    ProjectDetail projectDetail = projectService.findProject(apiUser.toUser(), projectId);
    ProjectDetailResponse response = ProjectDetailResponse.of(projectDetail);
    return ApiResponse.success(response);
  }

  @PatchMapping("/projects/{projectId}")
  public ApiResponse<Void> modifyProjectName(
      ApiUser apiUser,
      @PathVariable Long projectId,
      @RequestBody ModifyProjectNameRequest request) {
    projectService.modifyProjectName(apiUser.toUser(), projectId, request.name());
    return ApiResponse.success();
  }

  @PatchMapping("/projects/{projectId}/image")
  public ApiResponse<Void> modifyProjectImage(
      ApiUser apiUser, @PathVariable Long projectId, @RequestParam MultipartFile projectImage) {
    File imagefile = FileConverter.convert(projectImage);
    projectImageFacade.modifyProjectImage(apiUser.toUser(), projectId, imagefile);
    return ApiResponse.success();
  }

  @DeleteMapping("/projects/{projectId}")
  public ApiResponse<Void> deleteProject(ApiUser apiUser, @PathVariable Long projectId) {
    projectService.deleteProject(apiUser.toUser(), projectId);
    return ApiResponse.success();
  }

  @GetMapping("/projects/invitation/{invitationCode}")
  public ApiResponse<ProjectSummaryResponse> findInvitationProject(
      ApiUser apiUser, @PathVariable String invitationCode) {
    Project project = projectService.findInvitationProject(apiUser.toUser(), invitationCode);
    UserDetail userDetail = userService.findUserDetail(project.userId());
    ProjectSummaryResponse projectSummaryResponse = ProjectSummaryResponse.of(project, userDetail);
    return ApiResponse.success(projectSummaryResponse);
  }
}

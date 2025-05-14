package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.ModifySprintDueDate;
import com.ssafy.taskit.domain.ModifySprintName;
import com.ssafy.taskit.domain.NewSprint;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintService;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
public class SprintController {

  private final SprintService sprintService;

  public SprintController(SprintService sprintService) {
    this.sprintService = sprintService;
  }

  @PostMapping("/projects/{projectId}/sprints")
  public ApiResponse<DefaultIdResponse> appendSprint(
      ApiUser apiUser,
      @PathVariable Long projectId,
      @RequestBody @Validated AppendSprintRequest request) {
    NewSprint newSprint = request.toNewSprint();
    Sprint sprint = sprintService.append(apiUser.toUser(), projectId, newSprint);
    return ApiResponse.success(new DefaultIdResponse(sprint.id()));
  }

  @GetMapping("/projects/{projectId}/sprints")
  public ApiResponse<List<SprintDetailResponse>> findSprints(
      ApiUser apiUser, @PathVariable Long projectId) {
    List<Sprint> sprints = sprintService.findSprints(apiUser.toUser(), projectId);
    List<SprintDetailResponse> responses = SprintDetailResponse.of(sprints);
    return ApiResponse.success(responses);
  }

  @PatchMapping("/sprints/{sprintId}/name")
  public ApiResponse<Void> modifySprintName(
      ApiUser apiUser,
      @PathVariable Long sprintId,
      @RequestBody @Validated ModifySprintNameRequest request) {
    ModifySprintName modifySprintName = request.toModifySprintName();
    sprintService.modifySprintName(apiUser.toUser(), sprintId, modifySprintName);
    return ApiResponse.success();
  }

  @DeleteMapping("/sprints/{sprintId}")
  public ApiResponse<Void> deleteSprint(
      ApiUser apiUser, @PathVariable Long sprintId, @RequestBody DeleteSprintRequest request) {
    sprintService.deleteSprint(apiUser.toUser(), sprintId, request.option());
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/due-date")
  public ApiResponse<Void> modifySprintDueDate(
      ApiUser apiUser,
      @PathVariable Long sprintId,
      @RequestBody @Validated ModifySprintDueDateRequest request) {
    ModifySprintDueDate modifySprintDueDate = request.toModifySprintDueDate();
    sprintService.modifySprintDueDate(apiUser.toUser(), sprintId, modifySprintDueDate);
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/start")
  public ApiResponse<Void> startSprint(
      ApiUser apiUser, @PathVariable Long sprintId, @RequestBody StartSprintRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/complete")
  public ApiResponse<Void> completeSprint(
      ApiUser apiUser, @PathVariable Long sprintId, @RequestBody CompleteSprintRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/moveIssues")
  public ApiResponse<Void> moveSprintIssue(
      ApiUser apiUser, @PathVariable Long sprintId, @RequestBody MoveSprintIssueRequest request) {
    return ApiResponse.success();
  }
}

package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.NewSprint;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintService;
import com.ssafy.taskit.domain.SprintStatus;
import java.time.LocalDate;
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
    List<SprintDetailResponse> responses = List.of(
        new SprintDetailResponse(
            1L,
            "활성하기 전 스프린트 이름",
            SprintStatus.READY,
            LocalDate.of(2025, 04, 30),
            LocalDate.of(2025, 05, 01),
            null),
        new SprintDetailResponse(
            2L,
            "활성화 된 스프린트 이름",
            SprintStatus.ONGOING,
            LocalDate.of(2025, 04, 30),
            LocalDate.of(2025, 05, 01),
            null),
        new SprintDetailResponse(
            3L,
            "종료된 스프린트 이름",
            SprintStatus.COMPLETED,
            LocalDate.of(2025, 04, 29),
            LocalDate.of(2025, 05, 01),
            LocalDate.of(2025, 04, 30)));
    return ApiResponse.success(responses);
  }

  @PatchMapping("/sprints/{sprintId}/name")
  public ApiResponse<Void> modifySprintName(
      ApiUser apiUser, @PathVariable Long sprintId, @RequestBody ModifySprintNameRequest request) {
    return ApiResponse.success();
  }

  @DeleteMapping("/sprints/{sprintId}")
  public ApiResponse<Void> deleteSprint(
      ApiUser apiUser, @PathVariable Long sprintId, @RequestBody DeleteSprintRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/due-date")
  public ApiResponse<Void> modifySprintDueDate(
      ApiUser apiUser,
      @PathVariable Long sprintId,
      @RequestBody ModifySprintDueDateRequest request) {
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

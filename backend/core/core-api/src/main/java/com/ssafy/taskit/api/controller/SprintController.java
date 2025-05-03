package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.SprintStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
public class SprintController {

  @PostMapping("/projects/{projectId}/sprints")
  public ApiResponse<DefaultIdResponse> appendSprint(
      ApiUser user, @PathVariable Long projectId, @RequestBody AppendSprintRequest request) {
    DefaultIdResponse response = new DefaultIdResponse(1L);
    return ApiResponse.success(response);
  }

  @GetMapping("/projects/{projectId}/sprints")
  public ApiResponse<List<SprintDetailResponse>> findSprints(
      ApiUser user, @PathVariable Long projectId) {
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
      ApiUser user, @PathVariable Long sprintId, @RequestBody ModifySprintNameRequest request) {
    return ApiResponse.success();
  }

  @DeleteMapping("/sprints/{sprintId}")
  public ApiResponse<Void> deleteSprint(
      ApiUser user, @PathVariable Long sprintId, @RequestBody DeleteSprintRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/due-date")
  public ApiResponse<Void> modifySprintDueDate(
      ApiUser user, @PathVariable Long sprintId, @RequestBody ModifySprintDueDateRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/start")
  public ApiResponse<Void> startSprint(
      ApiUser user, @PathVariable Long sprintId, @RequestBody StartSprintRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/complete")
  public ApiResponse<Void> completeSprint(
      ApiUser user, @PathVariable Long sprintId, @RequestBody CompleteSprintRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("/sprints/{sprintId}/moveIssues")
  public ApiResponse<Void> moveSprintIssue(
      ApiUser user, @PathVariable Long sprintId, @RequestBody MoveSprintIssueRequest request) {
    return ApiResponse.success();
  }
}

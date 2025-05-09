package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.Assignee;
import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueService;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.SprintStatus;
import java.util.List;
import java.util.Map;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IssueController {

  private final IssueService issueService;

  public IssueController(IssueService issueService) {
    this.issueService = issueService;
  }

  @PostMapping("epics/{epicId}/issues")
  public ApiResponse<DefaultIdResponse> appendIssue(
      ApiUser apiUser,
      @PathVariable Long epicId,
      @RequestBody @Validated AppendIssueRequest request) {
    Issue issue = issueService.append(apiUser.toUser(), epicId, request.toNewIssue());
    return ApiResponse.success(new DefaultIdResponse(issue.id()));
  }

  @GetMapping("issues/{issueId}")
  public ApiResponse<IssueDetailResponse> findIssue(ApiUser apiUser, @PathVariable Long issueId) {
    IssueDetailResponse response = new IssueDetailResponse(
        1L,
        "이슈1",
        "내용1",
        "S12P31D207-2",
        5L,
        Importance.HIGH,
        IssueStatus.TODO,
        new ComponentResponse(1L, "BackEnd"),
        new AssigneeResponse(1L, "채용수", "https://prfile-image-test.jpg"),
        new IssueDetailEpicResponse(1L, "에픽1", "S12P31D207-1"),
        new SprintResponse(1L, "1주차 스프린트", SprintStatus.ONGOING));
    return ApiResponse.success(response);
  }

  @PatchMapping("issues/{issueId}/name")
  public ApiResponse<Void> modifyIssueName(
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueNameRequest request) {
    issueService.modifyIssueName(apiUser.toUser(), issueId, request.toModifyIssueName());
    return ApiResponse.success();
  }

  @PatchMapping("issues/{issueId}/assignee")
  public ApiResponse<Void> modifyIssueAssignee(
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueAssigneeRequest request) {
    issueService.modifyIssueAssignee(apiUser.toUser(), issueId, request.toModifyIssueAssignee());
    return ApiResponse.success();
  }

  @PatchMapping("issues/{issueId}/component")
  public ApiResponse<Void> modifyIssueComponent(
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueComponentRequest request) {
    issueService.modifyIssueComponent(apiUser.toUser(), issueId, request.toModifyIssueComponent());
    return ApiResponse.success();
  }

  @PatchMapping("issues/{issueId}/bizpoint")
  public ApiResponse<Void> modifyIssueBizpoint(
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueBizpointRequest request) {
    issueService.modifyIssueBizpoint(apiUser.toUser(), issueId, request.toModifyIssueBizpoint());
    return ApiResponse.success();
  }

  @PatchMapping("issues/{issueId}/importance")
  public ApiResponse<Void> modifyIssueImportance(
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueImportanceRequest request) {
    issueService.modifyIssueImportance(
        apiUser.toUser(), issueId, request.toModifyIssueImportance());
    return ApiResponse.success();
  }

  @PatchMapping("issues/{issueId}/content")
  public ApiResponse<Void> modifyIssueContent(
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueContentRequest request) {
    issueService.modifyIssueContent(apiUser.toUser(), issueId, request.toModifyIssueContent());
    return ApiResponse.success();
  }

  @PatchMapping("issues/{issueId}/epic")
  public ApiResponse<Void> modifyIssueEpic(
      ApiUser apiUser, @PathVariable Long issueId, @RequestBody ModifyIssueEpicRequest request) {
    return ApiResponse.success();
  }

  @PatchMapping("issues/{issueId}/status")
  public ApiResponse<Void> modifyIssueStatus(
      ApiUser apiUser, @PathVariable Long issueId, @RequestBody ModifyIssueStatusRequest request) {
    return ApiResponse.success();
  }

  @GetMapping("epics/{epicId}/issues")
  public ApiResponse<List<EpicIssuesResponse>> findEpicIssues(
      ApiUser apiUser, @PathVariable Long epicId) {
    List<Issue> epicIssues = issueService.findEpicIssues(apiUser.toUser(), epicId);
    List<Long> componentIds = epicIssues.stream().map(Issue::componentId).toList();
    List<Long> assigneeIds = epicIssues.stream().map(Issue::assigneeId).toList();
    Map<Long, Component> componentMap = issueService.generateComponentMap(componentIds);
    Map<Long, Assignee> assigneeMap = issueService.generateAssigneeMap(assigneeIds);
    List<EpicIssuesResponse> response =
        EpicIssuesResponse.of(epicIssues, componentMap, assigneeMap);
    return ApiResponse.success(response);
  }

  @GetMapping("sprints/{sprintId}/issues")
  public ApiResponse<List<SprintIssuesResponse>> findSprintIssues(
      ApiUser apiUser, @PathVariable Long sprintId) {
    List<SprintIssuesResponse> responses = List.of(
        new SprintIssuesResponse(
            1L,
            "이슈1",
            "S12P31D207-2",
            5L,
            Importance.HIGH,
            IssueStatus.IN_PROGRESS,
            new ComponentResponse(1L, "BackEnd"),
            new AssigneeResponse(1L, "채용수", "https://prfile-image-test.jpg"),
            new IssueDetailEpicResponse(1L, "에픽1", "S12P31D207-1")),
        new SprintIssuesResponse(
            2L,
            "이슈2",
            "S12P31D207-3",
            5L,
            Importance.HIGH,
            IssueStatus.IN_PROGRESS,
            new ComponentResponse(1L, "BackEnd"),
            new AssigneeResponse(1L, "채용수", "https://prfile-image-test.jpg"),
            new IssueDetailEpicResponse(1L, "에픽1", "S12P31D207-1")));
    return ApiResponse.success(responses);
  }

  @GetMapping("components/{componentId}/issues")
  public ApiResponse<List<ComponentIssuesResponse>> findComponentIssues(
      ApiUser apiUser, @PathVariable Long componentId) {

    List<ComponentIssuesResponse> response = List.of(
        new ComponentIssuesResponse(
            IssueStatus.TODO,
            List.of(new ComponentIssueResponse(
                1L,
                "이슈3",
                "S12P31D207-4",
                3L,
                Importance.LOW,
                new ComponentResponse(1L, "BackEnd"),
                new AssigneeResponse(1L, "채용수", "https://prfile-image-test.jpg"),
                new IssueDetailEpicResponse(1L, "에픽1", "S12P31D207-1")))),
        new ComponentIssuesResponse(
            IssueStatus.IN_PROGRESS,
            List.of(new ComponentIssueResponse(
                2L,
                "이슈2",
                "S12P31D207-3",
                5L,
                Importance.HIGH,
                new ComponentResponse(1L, "BackEnd"),
                new AssigneeResponse(1L, "채용수", "https://prfile-image-test.jpg"),
                new IssueDetailEpicResponse(1L, "에픽1", "S12P31D207-1")))),
        new ComponentIssuesResponse(
            IssueStatus.DONE,
            List.of(new ComponentIssueResponse(
                3L,
                "이슈1",
                "S12P31D207-2",
                5L,
                Importance.HIGH,
                new ComponentResponse(1L, "BackEnd"),
                new AssigneeResponse(1L, "채용수", "https://prfile-image-test.jpg"),
                new IssueDetailEpicResponse(1L, "에픽1", "S12P31D207-1")))));

    return ApiResponse.success(response);
  }

  @PatchMapping("issues/{issueId}/move-sprint")
  public ApiResponse<Void> modifyIssueSprint(
      ApiUser apiUser, @PathVariable Long issueId, @RequestBody ModifyIssueSprintRequest request) {
    return ApiResponse.success();
  }

  @GetMapping("issues/me")
  public ApiResponse<List<MyIssuesResponse>> findMyIssues(
      ApiUser apiUser, @RequestParam IssueStatus status, @RequestParam Long cursor) {

    List<MyIssuesResponse> response = List.of(
        new MyIssuesResponse(
            1L,
            "이슈 1",
            "S12P31D207-2",
            Importance.HIGH,
            new IssueDetailEpicResponse(1L, "에픽1", "S12P31D207-1"),
            new MyIssuesProjectResponse(1L, "프로젝트 1")),
        new MyIssuesResponse(
            2L,
            "이슈 2",
            "S12P31D207-3",
            Importance.LOW,
            new IssueDetailEpicResponse(1L, "에픽1", "S12P31D207-1"),
            new MyIssuesProjectResponse(1L, "프로젝트 1")));
    return ApiResponse.success(response);
  }
}

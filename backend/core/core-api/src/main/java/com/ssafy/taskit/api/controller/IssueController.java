package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.Assignee;
import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.EpicService;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueService;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.UserDetail;
import com.ssafy.taskit.domain.UserService;
import java.util.List;
import java.util.Map;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
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
  private final UserService userService;
  private final EpicService epicService;

  public IssueController(
      IssueService issueService, UserService userService, EpicService epicService) {
    this.issueService = issueService;
    this.userService = userService;
    this.epicService = epicService;
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
    Issue issue = issueService.findIssue(apiUser.toUser(), issueId);
    //    TODO: 컴포넌트 완성 시 구현
    //    Component component = componentService.findComponent(issue.componentId());
    Component component = new Component(1L, 1L, 1L, "컴포넌트1", "내용");
    ComponentResponse componentResponse = ComponentResponse.from(component);
    UserDetail userDetail = userService.findUserDetail(issue.assigneeId());
    AssigneeResponse assigneeResponse = AssigneeResponse.from(userDetail);
    Epic epic = epicService.findEpic(apiUser.toUser(), issue.epicId());
    IssueDetailEpicResponse epicResponse = IssueDetailEpicResponse.from(epic);
    //    TODO : 스프린트 완성 시 구현
    //    Sprint sprint = sprintService.findSprint(apiUser.toUser(), issue.sprintId());
    SprintResponse sprintResponse = SprintResponse.from();
    IssueDetailResponse response =
        IssueDetailResponse.of(issue, component, userDetail, epic, sprintResponse);
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

  @PatchMapping("issues/{issueId}/bizPoint")
  public ApiResponse<Void> modifyIssueBizPoint(
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
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueEpicRequest request) {
    issueService.modifyIssueEpic(apiUser.toUser(), issueId, request.toModifyIssueEpic());
    return ApiResponse.success();
  }

  @PatchMapping("issues/{issueId}/status")
  public ApiResponse<Void> modifyIssueStatus(
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueStatusRequest request) {
    issueService.modifyIssueStatus(apiUser.toUser(), issueId, request.toModifyIssueStatus());
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

    List<Issue> issues = issueService.findSprintIssues(apiUser.toUser(), sprintId);
    List<Long> componentIds = issues.stream().map(Issue::componentId).toList();
    List<Long> assigneeIds = issues.stream().map(Issue::assigneeId).toList();
    List<Long> epicIds = issues.stream().map(Issue::epicId).toList();
    Map<Long, Component> componentMap = issueService.generateComponentMap(componentIds);
    Map<Long, Assignee> assigneeMap = issueService.generateAssigneeMap(assigneeIds);
    Map<Long, Epic> epicMap = issueService.generateEpicMap(epicIds);
    List<SprintIssuesResponse> response =
        SprintIssuesResponse.of(issues, componentMap, assigneeMap, epicMap);
    return ApiResponse.success(response);
  }

  @GetMapping("components/{componentId}/issues")
  public ApiResponse<List<ComponentIssuesResponse>> findComponentIssues(
      ApiUser apiUser, @PathVariable Long componentId) {
    List<Issue> issues = issueService.findComponentIssues(apiUser.toUser(), componentId);
    List<Long> componentIds = issues.stream().map(Issue::componentId).toList();
    List<Long> assigneeIds = issues.stream().map(Issue::assigneeId).toList();
    List<Long> epicIds = issues.stream().map(Issue::epicId).toList();
    Map<Long, Component> componentMap = issueService.generateComponentMap(componentIds);
    Map<Long, Assignee> assigneeMap = issueService.generateAssigneeMap(assigneeIds);
    Map<Long, Epic> epicMap = issueService.generateEpicMap(epicIds);
    List<ComponentIssuesResponse> response =
        ComponentIssuesResponse.of(issues, componentMap, assigneeMap, epicMap);
    return ApiResponse.success(response);
  }

  @PatchMapping("issues/{issueId}/move-sprint")
  public ApiResponse<Void> modifyIssueSprint(
      ApiUser apiUser,
      @PathVariable Long issueId,
      @RequestBody @Validated ModifyIssueSprintRequest request) {
    issueService.modifyIssueSprint(apiUser.toUser(), issueId, request.toModifyIssueSprint());
    return ApiResponse.success();
  }

  @GetMapping("issues/me")
  public ApiResponse<List<MyIssuesResponse>> findMyIssues(
      ApiUser apiUser,
      @RequestParam IssueStatus issueStatus,
      @RequestParam Long cursorId,
      @RequestParam Integer pageSize) {
    List<Issue> issues =
        issueService.findMyIssues(apiUser.toUser(), issueStatus, cursorId, pageSize);
    List<Long> epicIds = issues.stream().map(Issue::epicId).distinct().toList();
    Map<Long, Epic> epicMap = issueService.generateEpicMap(epicIds);
    List<Long> projectIds =
        epicMap.values().stream().map(Epic::projectId).distinct().toList();
    Map<Long, Project> projectMap = issueService.generateProjectMap(projectIds);
    List<MyIssuesResponse> response = MyIssuesResponse.of(issues, epicMap, projectMap);
    return ApiResponse.success(response);
  }

  @DeleteMapping("issues/{issueId}")
  public ApiResponse<Void> deleteIssue(ApiUser apiUser, @PathVariable Long issueId) {
    issueService.deleteIssue(apiUser.toUser(), issueId);
    return ApiResponse.success();
  }
}

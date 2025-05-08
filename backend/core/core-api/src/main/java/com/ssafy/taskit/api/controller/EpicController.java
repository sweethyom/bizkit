package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.EpicService;
import com.ssafy.taskit.domain.IssueService;
import com.ssafy.taskit.domain.NewEpic;
import java.util.List;
import java.util.Map;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EpicController {

  private final EpicService epicService;
  private final IssueService issueService;

  public EpicController(EpicService epicService, IssueService issueService) {
    this.epicService = epicService;
    this.issueService = issueService;
  }

  @PostMapping("projects/{projectId}/epics")
  public ApiResponse<DefaultIdResponse> appendEpic(
      ApiUser apiUser,
      @PathVariable Long projectId,
      @RequestBody @Validated AppendEpicRequest request) {
    NewEpic newEpic = request.toNewEpic();
    Epic epic = epicService.append(apiUser.toUser(), projectId, newEpic);
    return ApiResponse.success(new DefaultIdResponse(epic.id()));
  }

  @GetMapping("projects/{projectId}/epics")
  public ApiResponse<List<EpicResponse>> findEpics(ApiUser apiUser, @PathVariable Long projectId) {
    List<Epic> epics = epicService.findEpics(apiUser.toUser(), projectId);
    List<Long> epicIds = epics.stream().map(Epic::id).toList();
    Map<Long, Integer> totalIssueCountMap = issueService.countTotalIssues(epicIds);
    Map<Long, Integer> backlogIssueCountMap = issueService.countBacklogIssues(epicIds);
    List<EpicResponse> response =
        EpicResponse.from(epics, totalIssueCountMap, backlogIssueCountMap);
    return ApiResponse.success(response);
  }

  @PatchMapping("epics/{epicId}/name")
  public ApiResponse<Void> modifyEpicName(
      ApiUser apiUser,
      @PathVariable Long epicId,
      @RequestBody @Validated ModifyEpicNameRequest request) {
    epicService.modifyEpic(apiUser.toUser(), epicId, request.toModifyEpic());
    return ApiResponse.success();
  }

  @DeleteMapping("epics/{epicId}")
  public ApiResponse<Void> deleteEpic(ApiUser apiUser, @PathVariable Long epicId) {
    epicService.deleteEpic(apiUser.toUser(), epicId);
    return ApiResponse.success();
  }
}

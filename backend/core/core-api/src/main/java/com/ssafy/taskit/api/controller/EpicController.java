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
    // 에픽 서비스가 아니라 이슈 서비스에서 하거나 cntService 따로 만들어야 할 듯?->이슈에서 해야할 듯
    // 에픽에서 보는게 아니고 이슈에서
    // 해당 이슈의 epicId가 epicIds에 있고(WHERE i.epicId in :epicIds)
    // 엔티티상태 active인(and i.entitystatus = :status(active)) 이슈 갯수
    // 전체이슈갯수 : select i.epicId, count(i) from IssueEntity i where i.epicId in :epicIds and
    // i.entitystatus = :status group by i.epicId
    // 남은 이슈 갯수는 where에 i.issuestatus not in :Done 하면 될 듯? -> 아님 스프린트 미할당인 이슈 갯수임
    Map<Long, Integer> totalIssueCountMap = issueService.countTotalIssues(epicIds);
    Map<Long, Integer> backlogIssueCountMap = issueService.countBacklogIssues(epicIds);
    List<EpicResponse> response =
        EpicResponse.from(epics, totalIssueCountMap, backlogIssueCountMap);
    return ApiResponse.success(response);
  }

  @PatchMapping("epics/{epicId}/name")
  public ApiResponse<Void> modifyEpicName(
      ApiUser apiUser, @PathVariable Long epicId, @RequestBody ModifyEpicNameRequest request) {
    return ApiResponse.success();
  }

  @DeleteMapping("epics/{epicId}")
  public ApiResponse<Void> deleteEpic(ApiUser apiUser, @PathVariable Long epicId) {
    return ApiResponse.success();
  }
}

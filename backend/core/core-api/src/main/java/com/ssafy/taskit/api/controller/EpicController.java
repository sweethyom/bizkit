package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EpicController {

  @PostMapping("projects/{projectId}/epics")
  public ApiResponse<DefaultIdResponse> appendEpic(
      ApiUser apiUser, @PathVariable Long projectId, @RequestBody AppendEpicRequest request) {
    DefaultIdResponse response = new DefaultIdResponse(1L);
    return ApiResponse.success(response);
  }

  @GetMapping("projects/{projectId}/epics")
  public ApiResponse<List<EpicResponse>> findEpics(ApiUser apiUser, @PathVariable Long projectId) {
    List<EpicResponse> response = List.of(
        new EpicResponse(1L, "프로젝트명-1", "에픽1", 10L, 3L),
        new EpicResponse(2L, "프로젝트명-2", "에픽2", 20L, 17L));
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

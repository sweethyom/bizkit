package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EpicController {

  @PostMapping("projects/{projectId}/epics")
  public ApiResponse<DefaultIdResponse> appendEpic(
      @PathVariable Long projectId, @RequestBody AppendEpicRequest request) {
    DefaultIdResponse response = new DefaultIdResponse(1L);
    return ApiResponse.success(response);
  }
}

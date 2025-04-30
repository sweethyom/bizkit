package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ComponentController {

  @PostMapping("/projects/{projectId}/components")
  public ApiResponse<DefaultIdResponse> appendComponent(
      ApiUser apiUser, @PathVariable Long projectId, @RequestBody AppendComponentRequest request) {
    DefaultIdResponse response = new DefaultIdResponse(1L);
    return ApiResponse.success(response);
  }

  @GetMapping("/projects/{projectId}/components")
  public ApiResponse<List<ComponentResponse>> findComponents(
      ApiUser apiUser, @PathVariable Long projectId) {
    List<ComponentResponse> responses = List.of(
        new ComponentResponse(1L, "프로젝트 이름1", "프로젝트 설명1"),
        new ComponentResponse(2L, "프로젝트 이름2", "프로젝트 설명2"),
        new ComponentResponse(3L, "프로젝트 이름3", "프로젝트 설명3"));
    return ApiResponse.success(responses);
  }

  @PutMapping("/components/{componentId}")
  public ApiResponse<DefaultIdResponse> modifyComponent(
      ApiUser apiUser,
      @PathVariable Long componentId,
      @RequestBody ModifyComponentRequest request) {
    DefaultIdResponse response = new DefaultIdResponse(1L);
    return ApiResponse.success(response);
  }

  @DeleteMapping("/components/{componentId}")
  public ApiResponse<Void> deleteComponent(ApiUser apiUser, @PathVariable Long componentId) {
    return ApiResponse.success();
  }
}

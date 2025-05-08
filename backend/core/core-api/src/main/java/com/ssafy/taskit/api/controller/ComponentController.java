package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.ComponentService;
import com.ssafy.taskit.domain.NewComponent;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ComponentController {

  private final ComponentService componentService;

  public ComponentController(ComponentService componentService) {
    this.componentService = componentService;
  }

  @PostMapping("/projects/{projectId}/components")
  public ApiResponse<DefaultIdResponse> appendComponent(
      ApiUser apiUser, @PathVariable Long projectId, @RequestBody AppendComponentRequest request) {
    NewComponent newComponent = request.toNewComponent();
    Component component = componentService.append(apiUser.toUser(), projectId, newComponent);
    return ApiResponse.success(new DefaultIdResponse(component.id()));
  }

  @GetMapping("/projects/{projectId}/components")
  public ApiResponse<List<ComponentDetailResponse>> findComponents(
      ApiUser apiUser, @PathVariable Long projectId) {
    List<ComponentDetailResponse> responses = List.of(
        new ComponentDetailResponse(1L, "프로젝트 이름1", "프로젝트 설명1"),
        new ComponentDetailResponse(2L, "프로젝트 이름2", "프로젝트 설명2"),
        new ComponentDetailResponse(3L, "프로젝트 이름3", "프로젝트 설명3"));
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

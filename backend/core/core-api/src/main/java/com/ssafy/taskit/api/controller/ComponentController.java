package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.ComponentService;
import com.ssafy.taskit.domain.NewComponent;
import java.util.List;
import org.springframework.validation.annotation.Validated;
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
      ApiUser apiUser,
      @PathVariable Long projectId,
      @RequestBody @Validated AppendComponentRequest request) {
    NewComponent newComponent = request.toNewComponent();
    Component component = componentService.append(apiUser.toUser(), projectId, newComponent);
    return ApiResponse.success(new DefaultIdResponse(component.id()));
  }

  @GetMapping("/projects/{projectId}/components")
  public ApiResponse<List<ComponentDetailResponse>> findComponents(
      ApiUser apiUser, @PathVariable Long projectId) {
    List<Component> components = componentService.findComponents(apiUser.toUser(), projectId);
    List<ComponentDetailResponse> responses = ComponentDetailResponse.of(components);
    return ApiResponse.success(responses);
  }

  @PutMapping("/components/{componentId}")
  public ApiResponse<DefaultIdResponse> modifyComponent(
      ApiUser apiUser,
      @PathVariable Long componentId,
      @RequestBody @Validated ModifyComponentRequest request) {
    componentService.modifyComponent(apiUser.toUser(), componentId, request.toModifyComponent());
    return ApiResponse.success(new DefaultIdResponse(componentId));
  }

  @DeleteMapping("/components/{componentId}")
  public ApiResponse<Void> deleteComponent(ApiUser apiUser, @PathVariable Long componentId) {
    componentService.deleteComponent(apiUser.toUser(), componentId);
    return ApiResponse.success();
  }
}

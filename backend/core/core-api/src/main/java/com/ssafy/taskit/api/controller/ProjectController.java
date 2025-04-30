package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectController {
  @PostMapping("/projects")
  public ApiResponse<DefaultIdResponse> appendProject(@RequestBody AppendProjectRequest request) {
    DefaultIdResponse response = new DefaultIdResponse(1L);
    return ApiResponse.success(response);
  }

  @GetMapping("/projects")
  public ApiResponse<List<ProjectResponse>> findProjects() {
    List<ProjectResponse> response = List.of(
        new ProjectResponse(1L, "프로젝트 이름1", "default1.jpg", 4),
        new ProjectResponse(2L, "프로젝트 이름2", "default2.jpg", 3),
        new ProjectResponse(3L, "프로젝트 이름3", "default3.jpg", 2));
    return ApiResponse.success(response);
  }
}

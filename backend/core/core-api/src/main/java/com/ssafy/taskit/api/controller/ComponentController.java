package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.api.response.DefaultIdResponse;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class ComponentController {

    @PostMapping("/projects/{projectId}/components")
    public ApiResponse<DefaultIdResponse> appendComponent(
            ApiUser apiUser, @PathVariable Long projectId, @RequestBody AppendComponentRequest request) {
        return ApiResponse.success(new DefaultIdResponse(1L));
    }
}

package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MemberController {

    @GetMapping("projects/{projectId}/members")
    public ApiResponse<List<MemberResponse>> findMembers(ApiUser apiUser, @PathVariable Long projectId){
        List<MemberResponse> responses = List.of(
            new MemberResponse(1L, "이싸피", "leessafy@ssafy.com", "lee.jpg", true),
            new MemberResponse(2L, "김싸피", "kimssafy@ssafy.com", "kim.jpg", false),
            new MemberResponse(3L, "박싸피", "parkssafy@ssafy.com", "park.jpg", false));
        return ApiResponse.success(responses);
    }
}

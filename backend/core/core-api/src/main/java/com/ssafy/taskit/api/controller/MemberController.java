package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
public class MemberController {

  @GetMapping("projects/{projectId}/members")
  public ApiResponse<List<MemberResponse>> findMembers(
      ApiUser apiUser, @PathVariable Long projectId) {
    List<MemberResponse> responses = List.of(
        new MemberResponse(1L, "이싸피", "leessafy@ssafy.com", "lee.jpg", true),
        new MemberResponse(2L, "김싸피", "kimssafy@ssafy.com", "kim.jpg", false),
        new MemberResponse(3L, "박싸피", "parkssafy@ssafy.com", "park.jpg", false));
    return ApiResponse.success(responses);
  }

  @GetMapping("projects/{projectId}/members/invitation")
  public ApiResponse<List<InvitedMemberResponse>> findInvitationMembers(
      ApiUser apiUser, @PathVariable Long projectId) {
    List<InvitedMemberResponse> responses = List.of(
        new InvitedMemberResponse("초대아이디1", 4L, "초대사용자닉네임1", "초대사용자이메일1", "default1.jpg"),
        new InvitedMemberResponse("초대아이디2", 5L, "초대사용자닉네임2", "초대사용자이메일2", "default2.jpg"),
        new InvitedMemberResponse("초대아이디3", 6L, "초대사용자닉네임3", "초대사용자이메일3", "default3.jpg"));
    return ApiResponse.success(responses);
  }

  @PostMapping("projects/{projectId}/members")
  public ApiResponse<InvitationResponse> appendInvitation(
      ApiUser apiUser, @PathVariable Long projectId, @RequestBody AppendInvitationRequest request) {
    InvitationResponse response = new InvitationResponse("초대코드1");
    return ApiResponse.success(response);
  }

  @DeleteMapping("projects/{projectId}/members/me")
  public ApiResponse<Void> leaveProject(ApiUser apiUser, @PathVariable Long projectId) {
    return ApiResponse.success();
  }

  @DeleteMapping("members/invitation/{invitationId}")
  public ApiResponse<Void> deleteInvitationMember(
      ApiUser apiUser, @PathVariable String invitationId) {
    return ApiResponse.success();
  }

  @DeleteMapping("members/{memberId}")
  public ApiResponse<Void> deleteMember(ApiUser apiUser, @PathVariable Long memberId) {
    return ApiResponse.success();
  }

  @PostMapping("members/invitation/{invitationId}")
  public ApiResponse<Void> acceptInvitation(ApiUser apiUser, @PathVariable String invitationId) {
    return ApiResponse.success();
  }
}

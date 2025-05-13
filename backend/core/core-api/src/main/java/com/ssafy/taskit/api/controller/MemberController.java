package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.response.ApiResponse;
import com.ssafy.taskit.domain.*;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
public class MemberController {

  private final MemberService memberService;
  private final UserService userService;

  private final IssueService issueService;

  public MemberController(
      MemberService memberService, UserService userService, IssueService issueService) {
    this.memberService = memberService;
    this.userService = userService;
    this.issueService = issueService;
  }

  @GetMapping("projects/{projectId}/members")
  public ApiResponse<List<MemberResponse>> findMembers(
      ApiUser apiUser, @PathVariable Long projectId) {
    List<Member> members = memberService.findMembers(apiUser.toUser(), projectId);
    List<Long> userIds = members.stream().map(Member::userId).toList();
    List<UserDetail> users = userService.findUserDetailsByIds(userIds);
    return ApiResponse.success(MemberResponse.of(members, users));
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
    memberService.deleteMember(apiUser.toUser(), memberId);
    Member member = memberService.findMember(memberId);
    List<Issue> issues = issueService.findIssuesByUserId(member.userId());
    issues.forEach(issue -> issueService.modifyIssueAssignee(
        apiUser.toUser(), issue.id(), new ModifyIssueAssignee(null)));
    return ApiResponse.success();
  }

  @PostMapping("members/invitation/{invitationId}")
  public ApiResponse<Void> acceptInvitation(ApiUser apiUser, @PathVariable String invitationId) {
    return ApiResponse.success();
  }
}

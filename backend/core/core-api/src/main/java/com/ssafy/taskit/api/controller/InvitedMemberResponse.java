package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Invitation;
import com.ssafy.taskit.domain.UserDetail;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record InvitedMemberResponse(
    String invitationCode, Long id, String nickname, String email, String profileImage) {

  public static List<InvitedMemberResponse> of(
      List<Invitation> invitations, List<UserDetail> users) {
    Map<Long, UserDetail> userMap =
        users.stream().collect(Collectors.toMap(UserDetail::id, user -> user));
    return invitations.stream()
        .map(invitation -> {
          UserDetail user = userMap.get(invitation.userId());
          return new InvitedMemberResponse(
              invitation.invitationCode(),
              invitation.userId(),
              user.nickname(),
              user.email(),
              user.profileImgUrl());
        })
        .toList();
  }
}

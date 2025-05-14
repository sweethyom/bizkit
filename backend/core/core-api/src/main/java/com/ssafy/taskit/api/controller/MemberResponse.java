package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Member;
import com.ssafy.taskit.domain.Role;
import com.ssafy.taskit.domain.UserDetail;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public record MemberResponse(
    Long id, Long userId, String nickname, String email, String profileImage, Boolean leader) {
  public static List<MemberResponse> of(List<Member> members, List<UserDetail> users) {
    Map<Long, UserDetail> userMap =
        users.stream().collect(Collectors.toMap(UserDetail::id, user -> user));
    return members.stream()
        .map(member -> {
          UserDetail user = userMap.get(member.userId());
          return new MemberResponse(
              member.id(),
              member.userId(),
              user.nickname(),
              user.email(),
              user.profileImgUrl(),
              member.memberRole() == Role.LEADER);
        })
        .toList();
  }
}

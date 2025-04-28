package com.ssafy.taskit.auth.api.controller.user;

import com.ssafy.taskit.auth.domain.user.AuthUser;

public record AuthUserResponse(Long id, String email, String nickname, String profileImageUrl) {

  public static AuthUserResponse from(AuthUser authUser) {
    return new AuthUserResponse(
        authUser.id(), authUser.email(), authUser.nickname(), authUser.profileImageUrl());
  }
}

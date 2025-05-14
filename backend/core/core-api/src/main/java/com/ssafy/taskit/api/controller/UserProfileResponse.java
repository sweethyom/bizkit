package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.UserDetail;

public record UserProfileResponse(Long id, String nickname, String profileImgUrl) {
  public static UserProfileResponse of(UserDetail userDetail) {
    return new UserProfileResponse(
        userDetail.id(), userDetail.nickname(), userDetail.profileImgUrl());
  }
}

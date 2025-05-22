package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.UserDetail;

public record AssigneeResponse(Long id, String nickname, String profileImageUrl) {
  public static AssigneeResponse from(UserDetail userDetail) {
    return new AssigneeResponse(userDetail.id(), userDetail.nickname(), userDetail.profileImgUrl());
  }
}

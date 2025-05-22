package com.ssafy.taskit.domain;

public record UserDetail(Long id, String nickname, String profileImgUrl, String email) {
  public static UserDetail empty() {
    return new UserDetail(null, "", "", "");
  }
}

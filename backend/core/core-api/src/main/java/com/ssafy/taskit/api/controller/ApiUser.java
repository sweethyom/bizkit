package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.User;

public record ApiUser(Long id) {

  public User toUser() {
    return new User(id);
  }

  public User fromUser(Long id) {
    return new User(id);
  }
}

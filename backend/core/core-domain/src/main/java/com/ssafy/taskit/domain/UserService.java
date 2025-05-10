package com.ssafy.taskit.domain;

import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserFinder userFinder;

  public UserService(UserFinder userFinder) {
    this.userFinder = userFinder;
  }

  public UserDetail findUserDetail(Long userId) {
    return userFinder.findUserDetail(userId);
  }
}

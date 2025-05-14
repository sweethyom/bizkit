package com.ssafy.taskit.domain;

import java.util.List;
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

  public List<UserDetail> findUserDetailsByIds(List<Long> userIds) {
    return userFinder.findUserDetailsByIds(userIds);
  }
}

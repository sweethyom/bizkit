package com.ssafy.taskit.domain;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserFinder userFinder;

  public UserService(UserFinder userFinder) {
    this.userFinder = userFinder;
  }

  public UserDetail findUserDetail(Long userId) {
    if (userId == null) {
      return UserDetail.empty();
    }
    return userFinder.findUserDetail(userId);
  }

  public List<UserDetail> findUserDetailsByIds(List<Long> userIds) {
    return userFinder.findUserDetailsByIds(userIds);
  }

  public Map<Long, UserDetail> mapByIds(List<Long> userIds) {
    if (userIds.isEmpty()) {
      return Collections.emptyMap();
    }
    List<UserDetail> userDetails = userFinder.findUserDetailsByIds(userIds);
    return userDetails.stream().collect(Collectors.toMap(UserDetail::id, Function.identity()));
  }
}

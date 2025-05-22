package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class UserFinder {

  private final UserRepository userRepository;

  public UserFinder(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public UserDetail findUserDetail(Long userId) {
    return userRepository
        .findUserDetail(userId)
        .orElseThrow(() -> new CoreException(CoreErrorType.USER_NOT_FOUND));
  }

  public List<UserDetail> findUserDetailsByIds(List<Long> userIds) {
    if (userIds.isEmpty()) {
      return List.of();
    }
    return userRepository.findUserDetailsByIdIn(userIds);
  }
}

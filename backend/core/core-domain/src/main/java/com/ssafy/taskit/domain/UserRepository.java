package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Optional;

public interface UserRepository {

  Optional<UserDetail> findUserDetail(Long userId);

  List<UserDetail> findUserDetailsByIdIn(List<Long> userIds);

  User findByEmail(String email);
}

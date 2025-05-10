package com.ssafy.taskit.domain;

import java.util.Optional;

public interface UserRepository {

  Optional<UserDetail> findUserDetail(Long userId);
}

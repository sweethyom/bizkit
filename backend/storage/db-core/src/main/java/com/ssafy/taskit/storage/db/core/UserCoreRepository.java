package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.UserDetail;
import com.ssafy.taskit.domain.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class UserCoreRepository implements UserRepository {

  private final UserJpaRepository userJpaRepository;

  public UserCoreRepository(UserJpaRepository userJpaRepository) {
    this.userJpaRepository = userJpaRepository;
  }

  @Override
  public Optional<UserDetail> findUserDetail(Long userId) {
    return userJpaRepository.findById(userId).map(UserEntity::toUserDetail);
  }
}

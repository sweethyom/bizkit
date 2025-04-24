package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.User;
import com.ssafy.s12p21d206.achu.domain.UserDetail;
import com.ssafy.s12p21d206.achu.domain.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class UserCoreRepository implements UserRepository {

  private final UserJpaRepository userJpaRepository;

  public UserCoreRepository(UserJpaRepository userJpaRepository) {
    this.userJpaRepository = userJpaRepository;
  }

  @Override
  public Optional<UserDetail> findUserDetail(User user) {
    return userJpaRepository.findById(user.id()).map(UserEntity::toUserDetail);
  }

  @Override
  public boolean existsById(Long id) {
    return userJpaRepository.existsById(id);
  }
}

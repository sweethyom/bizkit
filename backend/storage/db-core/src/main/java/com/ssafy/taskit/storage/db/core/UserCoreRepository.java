package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.UserDetail;
import com.ssafy.taskit.domain.UserRepository;
import java.util.List;
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

  @Override
  public List<UserDetail> findUserDetailsByIdIn(List<Long> userIds) {
    List<UserEntity> entities = userJpaRepository.findAllById(userIds);
    return entities.stream().map(UserEntity::toUserDetail).toList();
  }

  @Override
  public Long findByEmail(String email) {
    return userJpaRepository.findByEmail(email);
  }
}

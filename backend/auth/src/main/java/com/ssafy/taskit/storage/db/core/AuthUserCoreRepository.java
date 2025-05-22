package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.auth.domain.error.AuthCoreErrorType;
import com.ssafy.taskit.auth.domain.error.AuthCoreException;
import com.ssafy.taskit.auth.domain.user.AuthUser;
import com.ssafy.taskit.auth.domain.user.AuthUserRepository;
import com.ssafy.taskit.auth.domain.user.NewAuthUser;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class AuthUserCoreRepository implements AuthUserRepository {

  private final AuthUserJpaRepository authUserJpaRepository;

  public AuthUserCoreRepository(AuthUserJpaRepository authUserJpaRepository) {
    this.authUserJpaRepository = authUserJpaRepository;
  }

  @Override
  public boolean existsByNickname(String nickname) {
    return authUserJpaRepository.existsByNicknameAndEntityStatus(nickname, AuthEntityStatus.ACTIVE);
  }

  @Override
  public boolean existsByEmail(String email) {
    return authUserJpaRepository.existsByEmailAndEntityStatus(email, AuthEntityStatus.ACTIVE);
  }

  @Override
  public AuthUser save(NewAuthUser newAuthUser) {
    return authUserJpaRepository.save(AuthUserEntity.from(newAuthUser)).toAuthUser();
  }

  @Override
  public AuthUser modifyNickname(Long userId, String nickname) {
    AuthUserEntity authUserEntity = authUserJpaRepository
        .findById(userId)
        .orElseThrow(() -> new AuthCoreException(AuthCoreErrorType.USER_NOT_FOUND));

    authUserEntity.changeNickname(nickname);

    authUserJpaRepository.save(authUserEntity);

    return authUserEntity.toAuthUser();
  }

  @Override
  public Optional<AuthUser> findByUsername(String username) {
    return authUserJpaRepository
        .findByEmailAndEntityStatus(username, AuthEntityStatus.ACTIVE)
        .map(AuthUserEntity::toAuthUser);
  }

  @Override
  public Optional<AuthUser> findById(Long userId) {
    return authUserJpaRepository
        .findByIdAndEntityStatus(userId, AuthEntityStatus.ACTIVE)
        .map(AuthUserEntity::toAuthUser);
  }

  @Override
  public AuthUser modifyPassword(Long userId, String encodedPassword) {

    AuthUserEntity authUserEntity = authUserJpaRepository
        .findById(userId)
        .orElseThrow(() -> new AuthCoreException(AuthCoreErrorType.USER_NOT_FOUND));

    authUserEntity.changePassword(encodedPassword);

    authUserJpaRepository.save(authUserEntity);

    return authUserEntity.toAuthUser();
  }

  @Override
  public AuthUser modifyProfileImage(Long userId, String profileImageUrl) {
    AuthUserEntity authUserEntity = authUserJpaRepository
        .findById(userId)
        .orElseThrow(() -> new AuthCoreException(AuthCoreErrorType.USER_NOT_FOUND));

    authUserEntity.changeProfileImageUrl(profileImageUrl);

    authUserJpaRepository.save(authUserEntity);

    return authUserEntity.toAuthUser();
  }
}

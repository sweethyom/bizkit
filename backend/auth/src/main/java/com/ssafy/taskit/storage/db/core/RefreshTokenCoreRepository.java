package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.security.RefreshTokenRepository;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class RefreshTokenCoreRepository implements RefreshTokenRepository {

  private final RefreshTokenJpaRepository refreshTokenJpaRepository;

  public RefreshTokenCoreRepository(RefreshTokenJpaRepository refreshTokenJpaRepository) {
    this.refreshTokenJpaRepository = refreshTokenJpaRepository;
  }

  @Override
  public void upsert(String username, String refreshToken, Duration expireDuration) {
    RefreshTokenEntity entity =
        new RefreshTokenEntity(username, refreshToken, LocalDateTime.now().plus(expireDuration));
    refreshTokenJpaRepository.save(entity);
  }

  @Override
  public Optional<String> get(String username) {
    LocalDateTime now = LocalDateTime.now();
    return refreshTokenJpaRepository
        .findByUsernameAndExpirationTimeAfter(username, now)
        .map(RefreshTokenEntity::getRefreshToken);
  }
}

package com.ssafy.taskit.security;

import java.time.Duration;
import java.util.Optional;

public interface RefreshTokenRepository {

  void upsert(String username, String refreshToken, Duration expireDuration);

  Optional<String> get(String username);
}

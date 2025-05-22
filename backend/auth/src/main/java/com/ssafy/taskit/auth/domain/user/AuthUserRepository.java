package com.ssafy.taskit.auth.domain.user;

import java.util.Optional;

public interface AuthUserRepository {

  boolean existsByNickname(String nickname);

  boolean existsByEmail(String email);

  AuthUser save(NewAuthUser newAuthUser);

  AuthUser modifyNickname(Long userId, String nickname);

  Optional<AuthUser> findByUsername(String username);

  Optional<AuthUser> findById(Long userId);

  AuthUser modifyPassword(Long userId, String encodedPassword);

  AuthUser modifyProfileImage(Long userId, String profileImageUrl);
}

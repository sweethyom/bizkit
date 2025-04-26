package com.ssafy.taskit.auth.domain.user;

import com.ssafy.taskit.auth.domain.error.AuthCoreErrorType;
import com.ssafy.taskit.auth.domain.error.AuthCoreException;
import org.springframework.stereotype.Component;

@Component
public class AuthUserReader {

  private final AuthUserRepository authUserRepository;

  public AuthUserReader(AuthUserRepository authUserRepository) {
    this.authUserRepository = authUserRepository;
  }

  public AuthUser findAuthUser(Long userId) {
    return authUserRepository
        .findById(userId)
        .orElseThrow(() -> new AuthCoreException(AuthCoreErrorType.USER_NOT_FOUND));
  }

  public AuthUser findAuthUserByUsername(String username) {
    return authUserRepository
        .findByUsername(username)
        .orElseThrow(() -> new AuthCoreException(AuthCoreErrorType.USER_NOT_FOUND));
  }
}

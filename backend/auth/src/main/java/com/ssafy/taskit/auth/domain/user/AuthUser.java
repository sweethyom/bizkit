package com.ssafy.taskit.auth.domain.user;

import com.ssafy.taskit.auth.domain.error.AuthCoreErrorType;
import com.ssafy.taskit.auth.domain.error.AuthCoreException;
import com.ssafy.taskit.auth.domain.support.AuthDefaultDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;

public record AuthUser(
    Long id,
    String email,
    String password,
    String nickname,
    String profileImageUrl,
    AuthDefaultDateTime defaultDateTime) {

  public void validatePassword(PasswordEncoder passwordEncoder, String password) {
    if (!passwordEncoder.matches(password, this.password)) {
      throw new AuthCoreException(AuthCoreErrorType.INVALID_CREDENTIALS);
    }
  }
}

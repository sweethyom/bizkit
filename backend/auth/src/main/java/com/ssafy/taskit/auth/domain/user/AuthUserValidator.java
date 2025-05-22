package com.ssafy.taskit.auth.domain.user;

import com.ssafy.taskit.auth.domain.error.AuthCoreErrorType;
import com.ssafy.taskit.auth.domain.error.AuthCoreException;
import org.springframework.stereotype.Component;

@Component
public class AuthUserValidator {

  private final AuthUserRepository authUserRepository;

  public AuthUserValidator(AuthUserRepository authUserRepository) {
    this.authUserRepository = authUserRepository;
  }

  public boolean isEmailUnique(String email) {
    return !authUserRepository.existsByEmail(email);
  }

  public boolean isNicknameUnique(String nickname) {
    return !authUserRepository.existsByNickname(nickname);
  }

  public void validateNicknameUnique(String nickname) {
    if (authUserRepository.existsByNickname(nickname)) {
      throw new AuthCoreException(AuthCoreErrorType.DUPLICATED_NICKNAME);
    }
  }
}

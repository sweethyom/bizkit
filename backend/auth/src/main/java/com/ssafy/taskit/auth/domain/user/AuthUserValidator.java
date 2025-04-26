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

  public boolean isNicknameUnique(String nickname) {
    return !authUserRepository.existsByNickname(nickname);
  }

  public boolean isUsernameUnique(String username) {
    return !authUserRepository.existsByEmail(username);
  }

  public void validateUsernameUnique(String username) {
    if (authUserRepository.existsByEmail(username)) {
      throw new AuthCoreException(AuthCoreErrorType.DUPLICATED_USERNAME);
    }
  }

  public void validateNicknameUnique(String nickname) {
    if (authUserRepository.existsByNickname(nickname)) {
      throw new AuthCoreException(AuthCoreErrorType.DUPLICATED_NICKNAME);
    }
  }
}

package com.ssafy.taskit.auth.domain.user;

import com.ssafy.taskit.auth.domain.verification.VerificationCodeVerifier;
import com.ssafy.taskit.auth.domain.verification.VerificationPurpose;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthUserModifier {

  private final AuthUserReader authUserReader;
  private final AuthUserValidator authUserValidator;
  private final VerificationCodeVerifier verificationCodeVerifier;

  private final AuthUserRepository authUserRepository;

  private final PasswordEncoder passwordEncoder;

  public AuthUserModifier(
      AuthUserReader authUserReader,
      AuthUserValidator authUserValidator,
      VerificationCodeVerifier verificationCodeVerifier,
      AuthUserRepository authUserRepository,
      PasswordEncoder passwordEncoder) {
    this.authUserReader = authUserReader;
    this.authUserValidator = authUserValidator;
    this.verificationCodeVerifier = verificationCodeVerifier;
    this.authUserRepository = authUserRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public AuthUser modifyNickname(Long userId, String nickname) {
    authUserValidator.validateNicknameUnique(nickname);
    return authUserRepository.modifyNickname(userId, nickname);
  }

  public AuthUser modifyPassword(Long userId, String oldPassword, String newPassword) {
    AuthUser authUser = authUserReader.findAuthUser(userId);
    authUser.validatePassword(passwordEncoder, oldPassword);

    String encodedPassword = passwordEncoder.encode(newPassword);
    return authUserRepository.modifyPassword(userId, encodedPassword);
  }

  public AuthUser resetPassword(String username, String newPassword, UUID verificationCodeId) {
    AuthUser authUser = authUserReader.findAuthUserByUsername(username);
    verificationCodeVerifier.validateVerificationCodeVerified(
        authUser.email(), verificationCodeId, VerificationPurpose.RESET_PASSWORD);

    String encodedPassword = passwordEncoder.encode(newPassword);
    return authUserRepository.modifyPassword(authUser.id(), encodedPassword);
  }

  public AuthUser modifyProfileImage(Long userId, String profileImageUrl) {
    return authUserRepository.modifyProfileImage(userId, profileImageUrl);
  }
}

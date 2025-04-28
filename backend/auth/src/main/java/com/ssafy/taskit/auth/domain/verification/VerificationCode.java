package com.ssafy.taskit.auth.domain.verification;

import com.ssafy.taskit.auth.domain.error.AuthCoreErrorType;
import com.ssafy.taskit.auth.domain.error.AuthCoreException;
import com.ssafy.taskit.auth.domain.support.AuthDefaultDateTime;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

public class VerificationCode {
  private final UUID id;
  private final String email;
  private final String code;
  private final VerificationPurpose purpose;
  private final Duration expiresIn;
  private final AuthDefaultDateTime defaultDateTime;
  private boolean isVerified;

  public VerificationCode(
      UUID id,
      String email,
      String code,
      VerificationPurpose purpose,
      Duration expiresIn,
      AuthDefaultDateTime defaultDateTime,
      boolean isVerified) {
    this.id = id;
    this.email = email;
    this.code = code;
    this.purpose = purpose;
    this.expiresIn = expiresIn;
    this.defaultDateTime = defaultDateTime;
    this.isVerified = isVerified;
  }

  public void verify(String code) {
    if (isVerified) {
      throw new AuthCoreException(AuthCoreErrorType.INVALID_VERIFICATION_CODE);
    }

    if (!this.code.equals(code)) {
      throw new AuthCoreException(AuthCoreErrorType.INVALID_VERIFICATION_CODE);
    }

    if (defaultDateTime.createdAt().plus(expiresIn).isBefore(LocalDateTime.now())) {
      throw new AuthCoreException(AuthCoreErrorType.INVALID_VERIFICATION_CODE);
    }

    isVerified = true;
  }

  public UUID getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getCode() {
    return code;
  }

  public VerificationPurpose getPurpose() {
    return purpose;
  }

  public Duration getExpiresIn() {
    return expiresIn;
  }

  public AuthDefaultDateTime getDefaultDateTime() {
    return defaultDateTime;
  }

  public boolean isVerified() {
    return isVerified;
  }

  public boolean isOwner(String email) {
    return this.email.equals(email);
  }
}

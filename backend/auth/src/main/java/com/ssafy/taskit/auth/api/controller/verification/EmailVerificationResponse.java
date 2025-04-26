package com.ssafy.taskit.auth.api.controller.verification;

import com.ssafy.taskit.auth.domain.verification.VerificationCode;
import java.time.Duration;
import java.util.UUID;

public record EmailVerificationResponse(UUID id, Duration expiresIn) {

  public static EmailVerificationResponse of(VerificationCode phoneVerificationCode) {
    return new EmailVerificationResponse(
        phoneVerificationCode.getId(), phoneVerificationCode.getExpiresIn());
  }
}

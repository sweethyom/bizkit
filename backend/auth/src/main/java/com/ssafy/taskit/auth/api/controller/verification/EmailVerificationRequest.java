package com.ssafy.taskit.auth.api.controller.verification;

import com.ssafy.taskit.auth.domain.verification.VerificationPurpose;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record EmailVerificationRequest(
    @NotNull @Email String email, @NotNull VerificationPurpose purpose) {

  public VerificationPurpose toVerificationPurpose() {
    return purpose;
  }
}

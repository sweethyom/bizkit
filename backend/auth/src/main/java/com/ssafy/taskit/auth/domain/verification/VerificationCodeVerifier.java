package com.ssafy.taskit.auth.domain.verification;

import com.ssafy.taskit.auth.domain.error.AuthCoreErrorType;
import com.ssafy.taskit.auth.domain.error.AuthCoreException;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class VerificationCodeVerifier {

  private final VerificationCodeRepository verificationCodeRepository;

  public VerificationCodeVerifier(VerificationCodeRepository verificationCodeRepository) {
    this.verificationCodeRepository = verificationCodeRepository;
  }

  public void verify(UUID verificationCodeId, String code) {
    VerificationCode verificationCode = verificationCodeRepository
        .findById(verificationCodeId)
        .orElseThrow(() -> new AuthCoreException(AuthCoreErrorType.INVALID_VERIFICATION_CODE));
    verificationCode.verify(code);
    verificationCodeRepository.update(verificationCode);
  }

  public void validateVerificationCodeVerified(
      String email, UUID verificationCodeId, VerificationPurpose purpose) {
    VerificationCode verificationCode = verificationCodeRepository
        .findByIdAndPurpose(verificationCodeId, purpose)
        .orElseThrow(() -> new AuthCoreException(AuthCoreErrorType.UNVERIFIED_VERIFICATION_CODE));

    if (!verificationCode.isVerified()) {
      throw new AuthCoreException(AuthCoreErrorType.UNVERIFIED_VERIFICATION_CODE);
    }

    if (!verificationCode.isOwner(email)) {
      throw new AuthCoreException(AuthCoreErrorType.UNVERIFIED_VERIFICATION_CODE);
    }
  }
}

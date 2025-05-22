package com.ssafy.taskit.auth.domain.verification;

import java.util.Optional;
import java.util.UUID;

public interface VerificationCodeRepository {

  VerificationCode save(
      NewVerificationCode verificationCode, String email, VerificationPurpose purpose);

  Optional<VerificationCode> findLatestByPhone(String email);

  Optional<VerificationCode> findById(UUID id);

  void update(VerificationCode verificationCode);

  Optional<VerificationCode> findByIdAndPurpose(
      UUID verificationCodeId, VerificationPurpose purpose);
}

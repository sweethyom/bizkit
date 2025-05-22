package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.auth.domain.verification.NewVerificationCode;
import com.ssafy.taskit.auth.domain.verification.VerificationCode;
import com.ssafy.taskit.auth.domain.verification.VerificationCodeRepository;
import com.ssafy.taskit.auth.domain.verification.VerificationPurpose;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public class OnetimeCodeCoreRepository implements VerificationCodeRepository {

  private final OneTimeCodeJpaRepository oneTimeCodeJpaRepository;

  public OnetimeCodeCoreRepository(OneTimeCodeJpaRepository oneTimeCodeJpaRepository) {
    this.oneTimeCodeJpaRepository = oneTimeCodeJpaRepository;
  }

  @Override
  public VerificationCode save(
      NewVerificationCode verificationCode, String email, VerificationPurpose purpose) {
    return oneTimeCodeJpaRepository
        .save(OneTimeCodeEntity.from(verificationCode, email, purpose))
        .toVerificationCode();
  }

  @Override
  public Optional<VerificationCode> findLatestByPhone(String email) {
    return oneTimeCodeJpaRepository
        .findTopByEmailAndEntityStatusOrderByCreatedAtDesc(email, AuthEntityStatus.ACTIVE)
        .map(OneTimeCodeEntity::toVerificationCode);
  }

  @Override
  public Optional<VerificationCode> findById(UUID id) {
    return oneTimeCodeJpaRepository
        .findByIdAndEntityStatus(id, AuthEntityStatus.ACTIVE)
        .map(OneTimeCodeEntity::toVerificationCode);
  }

  @Override
  public void update(VerificationCode verificationCode) {
    oneTimeCodeJpaRepository.save(OneTimeCodeEntity.from(verificationCode));
  }

  @Override
  public Optional<VerificationCode> findByIdAndPurpose(UUID id, VerificationPurpose purpose) {
    return oneTimeCodeJpaRepository
        .findByIdAndPurposeAndEntityStatus(id, purpose, AuthEntityStatus.ACTIVE)
        .map(OneTimeCodeEntity::toVerificationCode);
  }
}

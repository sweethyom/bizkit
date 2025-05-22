package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.auth.domain.verification.VerificationPurpose;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OneTimeCodeJpaRepository extends JpaRepository<OneTimeCodeEntity, UUID> {

  Optional<OneTimeCodeEntity> findTopByEmailAndEntityStatusOrderByCreatedAtDesc(
      String email, AuthEntityStatus entityStatus);

  Optional<OneTimeCodeEntity> findByIdAndEntityStatus(UUID id, AuthEntityStatus entityStatus);

  Optional<OneTimeCodeEntity> findByIdAndPurposeAndEntityStatus(
      UUID id, VerificationPurpose purpose, AuthEntityStatus entityStatus);
}

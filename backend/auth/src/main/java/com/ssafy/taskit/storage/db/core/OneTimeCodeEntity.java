package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.auth.domain.support.AuthDefaultDateTime;
import com.ssafy.taskit.auth.domain.verification.NewVerificationCode;
import com.ssafy.taskit.auth.domain.verification.VerificationCode;
import com.ssafy.taskit.auth.domain.verification.VerificationPurpose;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Duration;
import java.util.UUID;

@Table(name = "verification_code")
@Entity
public class OneTimeCodeEntity extends AuthMetaEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id; // java.util.uuid

  private String email;
  private String code;

  @Enumerated(EnumType.STRING)
  private VerificationPurpose purpose;

  private boolean isVerified;

  private Duration expiresIn;

  protected OneTimeCodeEntity() {}

  public OneTimeCodeEntity(
      UUID id,
      String email,
      String code,
      VerificationPurpose purpose,
      boolean isVerified,
      Duration expiresIn) {
    this.id = id;
    this.email = email;
    this.code = code;
    this.purpose = purpose;
    this.isVerified = isVerified;
    this.expiresIn = expiresIn;
  }

  public static OneTimeCodeEntity from(
      NewVerificationCode verificationCode, String email, VerificationPurpose purpose) {
    return new OneTimeCodeEntity(
        null, email, verificationCode.code(), purpose, false, verificationCode.expiresIn());
  }

  public static OneTimeCodeEntity from(VerificationCode verificationCode) {
    return new OneTimeCodeEntity(
        verificationCode.getId(),
        verificationCode.getEmail(),
        verificationCode.getCode(),
        verificationCode.getPurpose(),
        verificationCode.isVerified(),
        verificationCode.getExpiresIn());
  }

  public VerificationCode toVerificationCode() {
    return new VerificationCode(
        this.id,
        this.email,
        code,
        purpose,
        expiresIn,
        new AuthDefaultDateTime(getCreatedAt(), getUpdatedAt()),
        isVerified);
  }
}

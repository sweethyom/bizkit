package com.ssafy.taskit.auth.domain.verification;

import org.springframework.stereotype.Component;

@Component
public class VerificationCodeIssuer {

  private final RequestIntervalValidator requestIntervalValidator;
  private final VerificationCodeGenerator verificationCodeGenerator;
  private final VerificationCodeRepository verificationCodeRepository;

  public VerificationCodeIssuer(
      RequestIntervalValidator requestIntervalValidator,
      VerificationCodeGenerator verificationCodeGenerator,
      VerificationCodeRepository verificationCodeRepository) {
    this.requestIntervalValidator = requestIntervalValidator;
    this.verificationCodeGenerator = verificationCodeGenerator;
    this.verificationCodeRepository = verificationCodeRepository;
  }

  /**
   * 인증번호를 생성하고 저장합니다.
   */
  public VerificationCode issue(String email, VerificationPurpose purpose) {
    requestIntervalValidator.validate(email);
    NewVerificationCode newVerificationCode = verificationCodeGenerator.generate();
    return verificationCodeRepository.save(newVerificationCode, email, purpose);
  }
}

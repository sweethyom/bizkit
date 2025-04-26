package com.ssafy.taskit.auth.domain.verification;

import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationService {

  private final VerificationCodeIssuer verificationCodeIssuer;
  private final VerificationCodeSender verificationCodeSender;
  private final VerificationCodeVerifier verificationCodeVerifier;

  public EmailVerificationService(
      VerificationCodeIssuer verificationCodeIssuer,
      VerificationCodeSender verificationCodeSender,
      VerificationCodeVerifier verificationCodeVerifier) {
    this.verificationCodeIssuer = verificationCodeIssuer;
    this.verificationCodeSender = verificationCodeSender;
    this.verificationCodeVerifier = verificationCodeVerifier;
  }

  public VerificationCode issuePhoneVerificationCode(String email, VerificationPurpose purpose) {
    VerificationCode verificationCode = verificationCodeIssuer.issue(email, purpose);
    verificationCodeSender.push(verificationCode);
    return verificationCode;
  }

  public void verifyPhoneVerificationCode(UUID verificationId, String code) {
    verificationCodeVerifier.verify(verificationId, code);
  }
}

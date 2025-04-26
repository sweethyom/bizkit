package com.ssafy.taskit.auth.domain.verification;

import java.security.SecureRandom;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class VerificationCodeGenerator {

  @Value("${taskit.verification-code.length}")
  private int verificationCodeLength;

  @Value("${taskit.verification-code.expires-in-seconds}")
  private int expiresInSeconds;

  private final SecureRandom random = new SecureRandom();

  public NewVerificationCode generate() {
    String code = generateCode();
    Duration expiresIn = Duration.ofSeconds(expiresInSeconds);
    return new NewVerificationCode(code, expiresIn);
  }

  private String generateCode() {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < verificationCodeLength; i++) {
      sb.append(random.nextInt(10));
    }
    return sb.toString();
  }
}

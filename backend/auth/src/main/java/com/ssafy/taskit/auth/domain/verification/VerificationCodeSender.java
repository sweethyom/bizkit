package com.ssafy.taskit.auth.domain.verification;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class VerificationCodeSender {

  private final VerificationCodeSendClient verificationCodeSendClient;

  public VerificationCodeSender(VerificationCodeSendClient verificationCodeSendClient) {
    this.verificationCodeSendClient = verificationCodeSendClient;
  }

  @Async
  public void push(VerificationCode verificationCode) {
    verificationCodeSendClient.send(verificationCode);
  }
}

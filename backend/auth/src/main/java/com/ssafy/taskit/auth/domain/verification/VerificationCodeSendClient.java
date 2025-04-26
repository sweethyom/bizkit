package com.ssafy.taskit.auth.domain.verification;

public interface VerificationCodeSendClient {

  void send(VerificationCode code);
}

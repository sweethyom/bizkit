package com.ssafy.taskit.clients.email.client;

import com.ssafy.taskit.auth.domain.verification.VerificationCode;

public interface EmailVerificationCodeHtmlLoader {

  String loadWith(VerificationCode code);
}

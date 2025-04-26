package com.ssafy.taskit.auth.api.controller.verification;

import com.ssafy.taskit.auth.api.response.AuthApiResponse;
import com.ssafy.taskit.auth.domain.verification.EmailVerificationService;
import com.ssafy.taskit.auth.domain.verification.VerificationCode;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailVerificationController {

  private final EmailVerificationService emailVerificationService;

  public EmailVerificationController(EmailVerificationService emailVerificationService) {
    this.emailVerificationService = emailVerificationService;
  }

  @PostMapping("/verification/request")
  public AuthApiResponse<EmailVerificationResponse> createPhoneVerificationCode(
      @RequestBody @Validated EmailVerificationRequest request) {
    VerificationCode phoneVerificationCode = emailVerificationService.issuePhoneVerificationCode(
        request.email(), request.toVerificationPurpose());
    return AuthApiResponse.success(EmailVerificationResponse.of(phoneVerificationCode));
  }

  @PostMapping("/verification/verify")
  public AuthApiResponse<Void> validatePhoneVerificationCode(
      @RequestBody @Validated VerifyVerificationCodeRequest request) {
    emailVerificationService.verifyPhoneVerificationCode(request.id(), request.code());
    return AuthApiResponse.success();
  }
}

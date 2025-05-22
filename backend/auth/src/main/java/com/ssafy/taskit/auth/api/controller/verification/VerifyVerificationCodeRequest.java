package com.ssafy.taskit.auth.api.controller.verification;

import com.ssafy.taskit.auth.api.controller.validation.VerificationCode;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record VerifyVerificationCodeRequest(
    @NotNull UUID id, @NotNull @VerificationCode String code) {}

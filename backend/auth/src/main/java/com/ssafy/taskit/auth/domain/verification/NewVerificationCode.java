package com.ssafy.taskit.auth.domain.verification;

import java.time.Duration;

public record NewVerificationCode(String code, Duration expiresIn) {}

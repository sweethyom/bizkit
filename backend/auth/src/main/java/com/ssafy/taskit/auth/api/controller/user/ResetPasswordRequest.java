package com.ssafy.taskit.auth.api.controller.user;

import com.ssafy.taskit.auth.api.controller.validation.Password;
import com.ssafy.taskit.auth.api.controller.validation.Username;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ResetPasswordRequest(
    @NotNull @Username String username,
    @NotNull @Password String newPassword,
    @NotNull UUID verificationCodeId) {}

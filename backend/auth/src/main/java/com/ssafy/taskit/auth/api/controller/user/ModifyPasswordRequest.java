package com.ssafy.taskit.auth.api.controller.user;

import com.ssafy.taskit.auth.api.controller.validation.Password;
import jakarta.validation.constraints.NotBlank;

public record ModifyPasswordRequest(
    @NotBlank String oldPassword, @NotBlank @Password String newPassword) {}

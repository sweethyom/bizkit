package com.ssafy.taskit.auth.api.controller.user;

import com.ssafy.taskit.auth.api.controller.validation.Nickname;
import com.ssafy.taskit.auth.api.controller.validation.Password;
import com.ssafy.taskit.auth.domain.user.NewAuthUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AppendAuthUserRequest(
    @NotNull @Email String email,
    @NotNull @Password String password,
    @NotNull @Nickname String nickname,
    @NotNull UUID verificationCodeId) {

  public NewAuthUser toNewAuthUser() {
    return new NewAuthUser(email, password, nickname);
  }
}

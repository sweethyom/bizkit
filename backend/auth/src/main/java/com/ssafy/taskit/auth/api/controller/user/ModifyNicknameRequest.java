package com.ssafy.taskit.auth.api.controller.user;

import com.ssafy.taskit.auth.api.controller.validation.Nickname;
import jakarta.validation.constraints.NotNull;

public record ModifyNicknameRequest(@NotNull @Nickname String nickname) {}

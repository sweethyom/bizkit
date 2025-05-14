package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.NewInvitation;
import jakarta.validation.constraints.NotNull;

public record AppendInvitationRequest(@NotNull String email) {
  public NewInvitation toNewInvitation() {
    return new NewInvitation(this.email());
  }
}

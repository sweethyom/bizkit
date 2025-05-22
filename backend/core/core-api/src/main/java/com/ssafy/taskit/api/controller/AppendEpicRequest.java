package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.EpicName;
import com.ssafy.taskit.domain.NewEpic;
import jakarta.validation.constraints.NotNull;

public record AppendEpicRequest(@NotNull @EpicName String name) {
  public NewEpic toNewEpic() {
    return new NewEpic(this.name());
  }
}

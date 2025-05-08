package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.EpicName;
import com.ssafy.taskit.domain.ModifyEpic;
import jakarta.validation.constraints.NotNull;

public record ModifyEpicNameRequest(@NotNull @EpicName String name) {
  public ModifyEpic toModifyEpic() {
    return new ModifyEpic(this.name);
  }
}

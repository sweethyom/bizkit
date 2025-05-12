package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.ComponentContent;
import com.ssafy.taskit.api.validation.ComponentName;
import com.ssafy.taskit.domain.ModifyComponent;
import jakarta.validation.constraints.NotBlank;

public record ModifyComponentRequest(
    @NotBlank @ComponentName String name, @ComponentContent String content) {
  public ModifyComponent toModifyComponent() {
    return new ModifyComponent(this.name, this.content);
  }
}

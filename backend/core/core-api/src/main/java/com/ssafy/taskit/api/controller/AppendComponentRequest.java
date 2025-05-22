package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.ComponentContent;
import com.ssafy.taskit.api.validation.ComponentName;
import com.ssafy.taskit.domain.NewComponent;
import jakarta.validation.constraints.NotBlank;

public record AppendComponentRequest(
    @NotBlank @ComponentName String name, @ComponentContent String content) {

  public NewComponent toNewComponent() {
    return NewComponent.of(this.name(), this.content());
  }
}

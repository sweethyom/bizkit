package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.NewComponent;
import jakarta.validation.constraints.NotBlank;

public record AppendComponentRequest(@NotBlank String name, String content) {

  public NewComponent toNewComponent() {
    return NewComponent.of(this.name(), this.content());
  }
}

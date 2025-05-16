package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.ComponentContent;
import com.ssafy.taskit.domain.ModifyComponentContent;

public record ModifyComponentContentRequest(@ComponentContent String content) {
  public ModifyComponentContent toModifyComponentContent() {
    return new ModifyComponentContent(this.content);
  }
}

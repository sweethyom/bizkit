package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.NewComponent;

public record AppendComponentRequest(String name, String content) {

  public NewComponent toNewComponent() {
    return new NewComponent(this.name(), this.content());
  }
}

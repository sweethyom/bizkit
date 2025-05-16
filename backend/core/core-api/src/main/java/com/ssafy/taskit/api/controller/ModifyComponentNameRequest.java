package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.ComponentName;
import com.ssafy.taskit.domain.ModifyComponentName;

public record ModifyComponentNameRequest(@ComponentName String name) {
  public ModifyComponentName toModifyComponentName() {
    return new ModifyComponentName(this.name);
  }
}

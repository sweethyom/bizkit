package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.api.validation.BizPoint;
import com.ssafy.taskit.domain.ModifyIssueBizpoint;
import jakarta.validation.constraints.NotNull;

public record ModifyIssueBizpointRequest(@NotNull @BizPoint Long bizPoint) {
  public ModifyIssueBizpoint toModifyIssueBizpoint() {
    return new ModifyIssueBizpoint(this.bizPoint);
  }
}

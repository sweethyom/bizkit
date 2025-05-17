package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.CompleteSprint;

public record CompleteSprintRequest(Long id) {

  public CompleteSprint toCompleteSprint() {
    return new CompleteSprint(this.id);
  }
}

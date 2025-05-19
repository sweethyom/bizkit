package com.ssafy.taskit.domain;

public record CompleteSprint(Long id) {
  public CompleteSprint {
    if (id == null) {
      id = 0L;
    }
  }
}

package com.ssafy.taskit.domain;

public record Component(Long id, Long projectId, Long userId, String name, String content) {
  public static Component empty() {
    return new Component(null, null, null, "", "");
  }
}

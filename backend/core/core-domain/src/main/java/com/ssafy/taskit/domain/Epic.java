package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;

public record Epic(
    Long id, String name, String key, Long projectId, DefaultDateTime defaultDateTime) {
  public static Epic empty() {
    return new Epic(null, "", "", null, null);
  }
}

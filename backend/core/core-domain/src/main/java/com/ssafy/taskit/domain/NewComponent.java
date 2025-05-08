package com.ssafy.taskit.domain;

public record NewComponent(String name, String content) {
  public static NewComponent of(String name, String content) {
    String normalizedContent = (content == null || content.trim().isEmpty()) ? null : content;
    return new NewComponent(name, normalizedContent);
  }
}

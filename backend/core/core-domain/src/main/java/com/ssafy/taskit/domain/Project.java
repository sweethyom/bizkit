package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;

public class Project {
  private final Long id;
  private final Long userId;
  private final String name;
  private final String key;
  private final int currentSequence;
  private final String image;

  private final DefaultDateTime defaultDateTime;

  public Project(
      Long id,
      Long userId,
      String name,
      String key,
      int currentSequence,
      String image,
      DefaultDateTime defaultDateTime) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.key = key;
    this.currentSequence = currentSequence;
    this.image = image;
    this.defaultDateTime = defaultDateTime;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getKey() {
    return key;
  }

  public int getCurrentSequence() {
    return currentSequence;
  }

  public String getImage() {
    return image;
  }
}

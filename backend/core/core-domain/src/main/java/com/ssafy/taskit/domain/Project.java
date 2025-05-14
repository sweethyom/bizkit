package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;

public record Project(
    Long id,
    Long userId,
    String name,
    String key,
    int currentSequence,
    String image,
    DefaultDateTime defaultDateTime) {

  public Project nextSequence() {
    int nextSequence = currentSequence + 1;
    return new Project(id, userId, name, key, nextSequence, image, defaultDateTime);
  }

  public String generateKey() {
    return key + "-" + currentSequence;
  }

  public Long getId() {
    return this.id;
  }

  public String getName() {
    return this.name;
  }

  public String getImage() {
    return this.image;
  }

  public Long getUserId() {
    return this.userId;
  }
}

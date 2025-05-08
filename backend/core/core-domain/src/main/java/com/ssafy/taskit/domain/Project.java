package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;

public class Project {
  private final Long id;
  private final Long userId;
  private final String name;

  private final String key;
  private final String image;

  private final LocalDateTime viewedAt;

  private final DefaultDateTime defaultDateTime;

  public Project(
      Long id,
      Long userId,
      String name,
      String key,
      String image,
      LocalDateTime viewedAt,
      DefaultDateTime defaultDateTime) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.key = key;
    this.image = image;
    this.viewedAt = viewedAt;
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

  public String getImage() {
    return image;
  }
}

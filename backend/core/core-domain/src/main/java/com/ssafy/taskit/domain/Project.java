package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;

public class Project {
  private final Long id;
  private final String name;
  private final String image;

  private final DefaultDateTime defaultDateTime;

  public Project(Long id, String name, String image, DefaultDateTime defaultDateTime) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.defaultDateTime = defaultDateTime;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getImage() {
    return image;
  }
}

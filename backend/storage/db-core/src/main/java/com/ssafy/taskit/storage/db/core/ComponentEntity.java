package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Component;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "component")
@Entity
public class ComponentEntity extends BaseEntity {
  private Long projectId;

  private Long userId;
  private String name;
  private String content;

  protected ComponentEntity() {}

  public ComponentEntity(Long projectId, Long userId, String name, String content) {
    this.projectId = projectId;
    this.userId = userId;
    this.name = name;
    this.content = content;
  }

  public Component toComponent() {
    return new Component(getId(), this.projectId, this.userId, this.name, this.content);
  }

  public void updateComponentName(String name) {
    this.name = name;
  }

  public void updateComponentContent(String content) {
    this.content = content;
  }
}

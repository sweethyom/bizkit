package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Table(name = "project")
@Entity
public class ProjectEntity extends BaseEntity {

  private Long userId;
  private String name;
  private String key;
  private String imageUrl;

  private LocalDateTime viewedAt;

  protected ProjectEntity() {}

  public ProjectEntity(
      Long userId, String name, String key, String imageUrl, LocalDateTime viewedAt) {
    this.userId = userId;
    this.name = name;
    this.key = key;
    this.imageUrl = imageUrl;
    this.viewedAt = viewedAt;
  }

  public Project toProject() {
    return new Project(
        this.getId(),
        this.userId,
        this.name,
        this.key,
        this.imageUrl,
        this.viewedAt,
        new DefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
  }
}

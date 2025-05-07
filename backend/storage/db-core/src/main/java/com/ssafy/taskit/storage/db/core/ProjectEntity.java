package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "project")
@Entity
public class ProjectEntity extends BaseEntity {

  private String name;

  private String imageUrl;

  protected ProjectEntity() {}

  public ProjectEntity(String name, String imageUrl) {
    this.name = name;
    this.imageUrl = imageUrl;
  }

  public Project toProject() {
    return new Project(
        this.getId(),
        this.name,
        this.imageUrl,
        new DefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
  }
}

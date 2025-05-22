package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.ProjectDetail;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "project")
@Entity
public class ProjectEntity extends BaseEntity {

  private Long userId;
  private String name;

  @Column(name = "project_key")
  private String key;

  private int currentSequence;
  private String imageUrl;

  protected ProjectEntity() {}

  public ProjectEntity(Long userId, String name, String key, String imageUrl, int currentSequence) {
    this.userId = userId;
    this.name = name;
    this.key = key;
    this.imageUrl = imageUrl;
    this.currentSequence = currentSequence;
  }

  public Project toProject() {
    return new Project(
        this.getId(),
        this.userId,
        this.name,
        this.key,
        this.currentSequence,
        this.imageUrl,
        new DefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
  }

  public ProjectDetail toProjectDetail(boolean isLeader) {
    Project project = new Project(
        this.getId(),
        this.userId,
        this.name,
        this.key,
        this.currentSequence,
        this.imageUrl,
        new DefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
    return new ProjectDetail(project, isLeader);
  }

  public void updateSequence(int currentSequence) {
    this.currentSequence = currentSequence;
  }

  public void changeName(String name) {
    this.name = name;
  }

  public void changeImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }
}

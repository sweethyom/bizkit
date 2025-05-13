package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Table(name = "sprint")
@Entity
public class SprintEntity extends BaseEntity {

  private String name;

  @Enumerated(EnumType.STRING)
  private SprintStatus sprintStatus;

  private LocalDate startDate;

  private LocalDate dueDate;

  private LocalDate completedDate;

  private Long projectId;

  protected SprintEntity() {}

  public SprintEntity(String name, Long projectId) {
    this.name = name;
    this.sprintStatus = SprintStatus.READY;
    this.startDate = null;
    this.dueDate = null;
    this.completedDate = null;
    this.projectId = projectId;
  }

  public Sprint toSprint() {
    return new Sprint(
        this.getId(),
        this.name,
        this.sprintStatus,
        this.startDate,
        this.dueDate,
        this.completedDate,
        this.projectId);
  }
}

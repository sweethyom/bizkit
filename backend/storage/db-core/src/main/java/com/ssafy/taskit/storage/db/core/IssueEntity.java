package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.IssueStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Table(name = "issue")
@Entity
public class IssueEntity extends BaseEntity {

  private String name;

  private String content;

  private String key;

  private Long bizPoint;

  @Enumerated(EnumType.STRING)
  private Importance issueImportance;

  @Enumerated(EnumType.STRING)
  private IssueStatus issueStatus;

  private Long componentId;

  private Long assigneeId;

  private Long epicId;

  private Long sprintId;

  protected IssueEntity() {}

  public IssueEntity(
      String name,
      String content,
      String key,
      Long bizPoint,
      Importance issueImportance,
      IssueStatus issueStatus,
      Long componentId,
      Long assigneeId,
      Long epicId,
      Long sprintId) {
    this.name = name;
    this.content = content;
    this.key = key;
    this.bizPoint = bizPoint;
    this.issueImportance = issueImportance;
    this.issueStatus = issueStatus;
    this.componentId = componentId;
    this.assigneeId = assigneeId;
    this.epicId = epicId;
    this.sprintId = sprintId;
  }
}

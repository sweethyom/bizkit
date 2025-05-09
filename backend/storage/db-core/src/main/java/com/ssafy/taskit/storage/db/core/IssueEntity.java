package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.support.DefaultDateTime;
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

  public IssueEntity(String name, String key, Long epicId) {
    this.name = name;
    this.content = null;
    this.key = key;
    this.bizPoint = null;
    this.issueImportance = null;
    this.issueStatus = IssueStatus.UNASSIGNED;
    this.componentId = null;
    this.assigneeId = null;
    this.epicId = epicId;
    this.sprintId = null;
  }

  public Issue toIssue() {
    return new Issue(
        getId(),
        this.name,
        this.content,
        this.key,
        this.bizPoint,
        this.issueImportance,
        this.issueStatus,
        this.componentId,
        this.assigneeId,
        this.epicId,
        this.sprintId,
        new DefaultDateTime(getCreatedAt(), getUpdatedAt()));
  }

  public void updateIssueName(String name) {
    this.name = name;
  }

  public void updateIssueContent(String content) {
    this.content = content;
  }

  public void updateIssueAssignee(Long assigneeId) {
    this.assigneeId = assigneeId;
  }

  public void updateIssueComponent(Long componentId) {
    this.componentId = componentId;
  }
}

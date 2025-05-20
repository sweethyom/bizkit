package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.support.DefaultDateTime;

public record Issue(
    Long id,
    String name,
    String content,
    String key,
    Long bizPoint,
    Importance issueImportance,
    IssueStatus issueStatus,
    Long componentId,
    Long assigneeId,
    Long epicId,
    Long sprintId,
    Double position,
    DefaultDateTime defaultDateTime) {

  public boolean isReadyToStart() {
    return name != null
        && bizPoint != null
        && issueImportance != null
        && componentId != null
        && assigneeId != null
        && epicId != null;
  }
}

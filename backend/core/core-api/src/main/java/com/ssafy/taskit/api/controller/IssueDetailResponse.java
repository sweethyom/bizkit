package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.UserDetail;

public record IssueDetailResponse(
    Long id,
    String name,
    String content,
    String key,
    Long bizPoint,
    Importance issueImportance,
    IssueStatus issueStatus,
    ComponentResponse component,
    AssigneeResponse assignee,
    IssueDetailEpicResponse epic,
    SprintResponse sprint) {
  public static IssueDetailResponse of(
      Issue issue, Component component, UserDetail userDetail, Epic epic, Sprint sprint) {
    return new IssueDetailResponse(
        issue.id(),
        issue.name(),
        issue.content(),
        issue.key(),
        issue.bizPoint(),
        issue.issueImportance(),
        issue.issueStatus(),
        new ComponentResponse(component.id(), component.name()),
        new AssigneeResponse(userDetail.id(), userDetail.nickname(), userDetail.profileImgUrl()),
        new IssueDetailEpicResponse(epic.id(), epic.name(), epic.key()),
        new SprintResponse(sprint.id(), sprint.name(), sprint.sprintStatus()));
  }
}

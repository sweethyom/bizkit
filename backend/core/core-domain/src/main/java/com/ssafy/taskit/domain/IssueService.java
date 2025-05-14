package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class IssueService {

  private final IssueAppender issueAppender;
  private final IssueReader issueReader;
  private final IssueModifier issueModifier;
  private final IssueDeleter issueDeleter;

  public IssueService(
      IssueAppender issueAppender,
      IssueReader issueReader,
      IssueModifier issueModifier,
      IssueDeleter issueDeleter) {
    this.issueAppender = issueAppender;
    this.issueReader = issueReader;
    this.issueModifier = issueModifier;
    this.issueDeleter = issueDeleter;
  }

  public Issue append(User user, Long epicId, NewIssue newIssue) {
    return issueAppender.append(user, epicId, newIssue);
  }

  public Map<Long, Integer> countTotalIssues(List<Long> epicIds) {
    return Map.of();
  }

  public Map<Long, Integer> countBacklogIssues(List<Long> epicIds) {
    return Map.of();
  }

  public List<Issue> findEpicIssues(User user, Long epicId) {
    return issueReader.readEpicIssues(user, epicId);
  }

  public Map<Long, Component> generateComponentMap(List<Long> componentIds) {
    return Map.of();
  }

  public Map<Long, Assignee> generateAssigneeMap(List<Long> assigneeIds) {
    return Map.of();
  }

  public void modifyIssueName(User user, Long issueId, ModifyIssueName modifyIssueName) {
    issueModifier.modifyIssueName(user, issueId, modifyIssueName);
  }

  public void modifyIssueContent(User user, Long issueId, ModifyIssueContent modifyIssueContent) {
    issueModifier.modifyIssueContent(user, issueId, modifyIssueContent);
  }

  public void modifyIssueAssignee(
      User user, Long issueId, ModifyIssueAssignee modifyIssueAssignee) {
    issueModifier.modifyIssueAssignee(user, issueId, modifyIssueAssignee);
  }

  public void modifyIssueComponent(
      User user, Long issueId, ModifyIssueComponent modifyIssueComponent) {
    issueModifier.modifyIssueComponent(user, issueId, modifyIssueComponent);
  }

  public void modifyIssueBizpoint(
      User user, Long issueId, ModifyIssueBizpoint modifyIssueBizpoint) {
    issueModifier.modifyIssueBizpoint(user, issueId, modifyIssueBizpoint);
  }

  public void modifyIssueImportance(
      User user, Long issueId, ModifyIssueImportance modifyIssueImportance) {
    issueModifier.modifyIssueImportance(user, issueId, modifyIssueImportance);
  }

  public void modifyIssueStatus(User user, Long issueId, ModifyIssueStatus modifyIssueStatus) {
    issueModifier.modifyIssueStatus(user, issueId, modifyIssueStatus);
  }

  public void modifyIssueEpic(User user, Long issueId, ModifyIssueEpic modifyIssueEpic) {
    issueModifier.modifyIssueEpic(user, issueId, modifyIssueEpic);
  }

  public void modifyIssueSprint(User user, Long issueId, ModifyIssueSprint modifyIssueSprint) {
    issueModifier.modifyIssueSprint(user, issueId, modifyIssueSprint);
  }

  public List<Issue> findSprintIssues(User user, Long sprintId) {
    return issueReader.readSprintIssues(user, sprintId);
  }

  public Map<Long, Epic> generateEpicMap(List<Long> epicIds) {
    return Map.of();
  }

  public Issue findIssue(User user, Long issueId) {
    return issueReader.readIssue(user, issueId);
  }

  public List<Issue> findComponentIssues(User user, Long componentId) {
    return issueReader.readComponentIssues(user, componentId);
  }

  public List<Issue> findMyIssues(
      User user, IssueStatus issueStatus, Long cursorId, Integer pageSize) {
    if (cursorId == null) {
      return issueReader.readMyIssuesFirstPage(user, issueStatus, pageSize);
    }
    return issueReader.readMyIssues(user, issueStatus, cursorId, pageSize);
  }

  public Map<Long, Project> generateProjectMap(List<Long> projectIds) {
    return Map.of();
  }

  public void deleteIssue(User user, Long issueId) {
    issueDeleter.deleteIssue(user, issueId);
  }

  public List<Issue> findIssuesByUserId(Long userId) {
    return issueReader.readIssuesByUserId(userId);
  }
}

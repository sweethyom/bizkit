package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class IssueService {

  private final IssueAppender issueAppender;
  private final IssueReader issueReader;
  private final IssueModifier issueModifier;

  public IssueService(
      IssueAppender issueAppender, IssueReader issueReader, IssueModifier issueModifier) {
    this.issueAppender = issueAppender;
    this.issueReader = issueReader;
    this.issueModifier = issueModifier;
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
}

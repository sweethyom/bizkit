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
}

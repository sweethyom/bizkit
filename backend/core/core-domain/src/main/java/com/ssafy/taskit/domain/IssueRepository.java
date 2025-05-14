package com.ssafy.taskit.domain;

import java.util.List;

public interface IssueRepository {

  Issue save(Long epicId, NewIssue newIssue, String key);

  List<Issue> findEpicIssues(Long epicId);

  boolean existsByIdAndEntityStatus(Long issueId);

  Issue findById(Long issueId);

  void modifyIssueName(Long issueId, ModifyIssueName modifyIssueName);

  void modifyIssueContent(Long issueId, ModifyIssueContent modifyIssueContent);

  void modifyIssueAssignee(Long issueId, ModifyIssueAssignee modifyIssueAssignee);

  void modifyIssueComponent(Long issueId, ModifyIssueComponent modifyIssueComponent);

  void modifyIssueBizpoint(Long issueId, ModifyIssueBizpoint modifyIssueBizpoint);

  void modifyIssueImportance(Long issueId, ModifyIssueImportance modifyIssueImportance);

  void modifyIssueStatus(Long issueId, ModifyIssueStatus modifyIssueStatus);

  void modifyIssueEpic(Long issueId, ModifyIssueEpic modifyIssueEpic);

  void modifyIssueSprint(Long issueId, ModifyIssueSprint modifyIssueSprint);

  List<Issue> findSprintIssues(Long sprintId);

  List<Issue> findComponentIssues(Long componentId);

  List<Issue> findMyIssuesFirstPage(Long userId, IssueStatus issueStatus, Integer pageSize);

  List<Issue> findMyIssues(Long userId, IssueStatus issueStatus, Long cursorId, Integer pageSize);

  void delete(Long issueId);

  List<Issue> findByUserId(Long userId);
}

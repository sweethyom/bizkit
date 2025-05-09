package com.ssafy.taskit.domain;

import java.util.List;

public interface IssueRepository {

  Issue save(Long epicId, NewIssue newIssue, String key);

  List<Issue> findEpicIssues(Long epicId);

  boolean existsByIdAndEntityStatus(Long issueId);

  Issue findById(Long issueId);

  void modifyIssueName(Long issueId, ModifyIssueName modifyIssueName);

  void modifyIssueContent(Long issueId, ModifyIssueContent modifyIssueContent);
}

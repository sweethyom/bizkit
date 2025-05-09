package com.ssafy.taskit.domain;

import java.util.List;

public interface IssueRepository {

  Issue save(Long epicId, NewIssue newIssue, String key);

  List<Issue> findEpicIssues(Long epicId);
}

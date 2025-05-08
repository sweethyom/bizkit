package com.ssafy.taskit.domain;

public interface IssueRepository {

  Issue save(Long epicId, NewIssue newIssue, String key);
}

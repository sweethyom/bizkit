package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueRepository;
import com.ssafy.taskit.domain.NewIssue;
import org.springframework.stereotype.Repository;

@Repository
public class IssueCoreRepository implements IssueRepository {

  private final IssueJpaRepository issueJpaRepository;

  public IssueCoreRepository(IssueJpaRepository issueJpaRepository) {
    this.issueJpaRepository = issueJpaRepository;
  }

  @Override
  public Issue save(Long epicId, NewIssue newIssue, String key) {
    return issueJpaRepository
        .save(new IssueEntity(newIssue.name(), key, epicId))
        .toIssue();
  }
}

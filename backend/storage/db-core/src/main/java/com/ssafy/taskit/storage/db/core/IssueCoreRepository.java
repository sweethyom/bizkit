package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.IssueRepository;
import org.springframework.stereotype.Repository;

@Repository
public class IssueCoreRepository implements IssueRepository {

  private final IssueJpaRepository issueJpaRepository;

  public IssueCoreRepository(IssueJpaRepository issueJpaRepository) {
    this.issueJpaRepository = issueJpaRepository;
  }
}

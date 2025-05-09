package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueRepository;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.NewIssue;
import java.util.List;
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

  @Override
  public List<Issue> findEpicIssues(Long epicId) {
    List<IssueEntity> issueEntities = issueJpaRepository.findAllByEpicIdAndEntityStatus(
        epicId, EntityStatus.ACTIVE, IssueStatus.UNASSIGNED);
    return issueEntities.stream().map(IssueEntity::toIssue).toList();
  }
}

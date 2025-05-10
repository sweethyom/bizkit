package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueRepository;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.ModifyIssueAssignee;
import com.ssafy.taskit.domain.ModifyIssueBizpoint;
import com.ssafy.taskit.domain.ModifyIssueComponent;
import com.ssafy.taskit.domain.ModifyIssueContent;
import com.ssafy.taskit.domain.ModifyIssueImportance;
import com.ssafy.taskit.domain.ModifyIssueName;
import com.ssafy.taskit.domain.ModifyIssueStatus;
import com.ssafy.taskit.domain.NewIssue;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
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

  @Override
  public boolean existsByIdAndEntityStatus(Long issueId) {
    return issueJpaRepository.existsByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE);
  }

  @Override
  public Issue findById(Long issueId) {
    return issueJpaRepository
        .findByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND))
        .toIssue();
  }

  @Override
  public void modifyIssueName(Long issueId, ModifyIssueName modifyIssueName) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueName(modifyIssueName.name());
    issueJpaRepository.save(issueEntity);
  }

  @Override
  public void modifyIssueContent(Long issueId, ModifyIssueContent modifyIssueContent) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueContent(modifyIssueContent.content());
    issueJpaRepository.save(issueEntity);
  }

  @Override
  public void modifyIssueAssignee(Long issueId, ModifyIssueAssignee modifyIssueAssignee) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueAssignee(modifyIssueAssignee.assigneeId());
    issueJpaRepository.save(issueEntity);
  }

  @Override
  public void modifyIssueComponent(Long issueId, ModifyIssueComponent modifyIssueComponent) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueComponent(modifyIssueComponent.componentId());
    issueJpaRepository.save(issueEntity);
  }

  @Override
  public void modifyIssueBizpoint(Long issueId, ModifyIssueBizpoint modifyIssueBizpoint) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueBizpoint(modifyIssueBizpoint.bizPoint());
    issueJpaRepository.save(issueEntity);
  }

  @Override
  public void modifyIssueImportance(Long issueId, ModifyIssueImportance modifyIssueImportance) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueImportance(modifyIssueImportance.issueImportance());
    issueJpaRepository.save(issueEntity);
  }

  @Override
  public void modifyIssueStatus(Long issueId, ModifyIssueStatus modifyIssueStatus) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIssueIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueStatus(modifyIssueStatus.issueStatus());
    issueJpaRepository.save(issueEntity);
  }
}

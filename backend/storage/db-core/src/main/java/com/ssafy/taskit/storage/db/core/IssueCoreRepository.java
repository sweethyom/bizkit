package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueRepository;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.ModifyIssueAssignee;
import com.ssafy.taskit.domain.ModifyIssueBizpoint;
import com.ssafy.taskit.domain.ModifyIssueComponent;
import com.ssafy.taskit.domain.ModifyIssueContent;
import com.ssafy.taskit.domain.ModifyIssueEpic;
import com.ssafy.taskit.domain.ModifyIssueImportance;
import com.ssafy.taskit.domain.ModifyIssueName;
import com.ssafy.taskit.domain.ModifyIssueSprint;
import com.ssafy.taskit.domain.ModifyIssueStatus;
import com.ssafy.taskit.domain.NewIssue;
import com.ssafy.taskit.domain.SprintStatus;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    return issueJpaRepository.existsByIdAndEntityStatus(issueId, EntityStatus.ACTIVE);
  }

  @Override
  public Issue findById(Long issueId) {
    return issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND))
        .toIssue();
  }

  @Override
  @Transactional
  public void modifyIssueName(Long issueId, ModifyIssueName modifyIssueName) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueName(modifyIssueName.name());
  }

  @Override
  @Transactional
  public void modifyIssueContent(Long issueId, ModifyIssueContent modifyIssueContent) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueContent(modifyIssueContent.content());
  }

  @Override
  @Transactional
  public void modifyIssueAssignee(Long issueId, ModifyIssueAssignee modifyIssueAssignee) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueAssignee(modifyIssueAssignee.assigneeId());
  }

  @Override
  @Transactional
  public void modifyIssueComponent(Long issueId, ModifyIssueComponent modifyIssueComponent) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueComponent(modifyIssueComponent.componentId());
  }

  @Override
  @Transactional
  public void modifyIssueBizpoint(Long issueId, ModifyIssueBizpoint modifyIssueBizpoint) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueBizpoint(modifyIssueBizpoint.bizPoint());
  }

  @Override
  @Transactional
  public void modifyIssueImportance(Long issueId, ModifyIssueImportance modifyIssueImportance) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueImportance(modifyIssueImportance.issueImportance());
  }

  @Override
  @Transactional
  public void modifyIssueStatus(Long issueId, ModifyIssueStatus modifyIssueStatus) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueStatus(modifyIssueStatus.issueStatus());
  }

  @Override
  @Transactional
  public void modifyIssueEpic(Long issueId, ModifyIssueEpic modifyIssueEpic) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueEpic(modifyIssueEpic.epicId());
  }

  @Override
  @Transactional
  public void modifyIssueSprint(Long issueId, ModifyIssueSprint modifyIssueSprint) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueSprint(modifyIssueSprint.targetId());
  }

  @Override
  public List<Issue> findSprintIssues(Long sprintId) {
    List<IssueEntity> issueEntities =
        issueJpaRepository.findBySprintIdAndEntityStatus(sprintId, EntityStatus.ACTIVE);
    return issueEntities.stream().map(IssueEntity::toIssue).toList();
  }

  @Override
  public List<Issue> findComponentIssues(Long componentId) {
    List<IssueEntity> issueEntities = issueJpaRepository.findAllByComponentIdAndEntityStatus(
        componentId, EntityStatus.ACTIVE, SprintStatus.ONGOING);
    return issueEntities.stream().map(IssueEntity::toIssue).toList();
  }

  @Override
  public List<Issue> findMyIssuesFirstPage(Long userId, IssueStatus issueStatus, Integer pageSize) {
    Pageable pageable = PageRequest.of(0, pageSize);
    List<IssueEntity> issueEntities = issueJpaRepository.findMyIssuesFirstPage(
        userId, EntityStatus.ACTIVE, issueStatus, pageable);
    return issueEntities.stream().map(IssueEntity::toIssue).toList();
  }

  @Override
  public List<Issue> findMyIssues(
      Long userId, IssueStatus issueStatus, Long cursorId, Integer pageSize) {
    IssueEntity lastIssue = issueJpaRepository
        .findById(cursorId)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    LocalDateTime updatedAt = lastIssue.getUpdatedAt();

    Pageable pageable = PageRequest.of(0, pageSize);
    List<IssueEntity> issueEntities = issueJpaRepository.findMyIssuesAfterCursor(
        userId, EntityStatus.ACTIVE, issueStatus, updatedAt, cursorId, pageable);
    return issueEntities.stream().map(IssueEntity::toIssue).toList();
  }

  @Transactional
  @Override
  public void delete(Long issueId) {
    IssueEntity issueEntity = issueJpaRepository
        .findById(issueId)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.delete();
  }

  @Override
  public Map<Long, Long> countTotalIssuesByEpicIds(List<Long> epicIds) {
    List<Object[]> cntTotalIssues =
        issueJpaRepository.countTotalIssuesGroupedByEpicIds(epicIds, EntityStatus.ACTIVE);

    return cntTotalIssues.stream()
        .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));
  }

  @Override
  public Map<Long, Long> countBacklogIssuesByEpicIds(List<Long> epicIds) {
    List<Object[]> cntBacklogIssues = issueJpaRepository.countBacklogIssuesGroupedByEpicIds(
        epicIds, EntityStatus.ACTIVE, IssueStatus.UNASSIGNED);
    return cntBacklogIssues.stream()
        .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));
  }

  @Override
  public List<Issue> findByUserId(Long userId) {
    List<IssueEntity> issueEntities = issueJpaRepository.findByAssigneeId(userId);
    return issueEntities.stream().map(IssueEntity::toIssue).toList();
  }

  @Override
  @Transactional
  public void modifyIssueSprintToBacklog(Long issueId) {
    IssueEntity issueEntity = issueJpaRepository
        .findByIdAndEntityStatus(issueId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.ISSUE_NOT_FOUND));
    issueEntity.updateIssueSprintToBacklog();
  }
}

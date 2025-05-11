package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.util.EnumSet;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class IssueValidator {

  private final IssueRepository issueRepository;
  private static final Set<Importance> VALID_IMPORTANCES =
      EnumSet.of(Importance.HIGH, Importance.LOW);
  private static final Set<IssueStatus> VALID_STATUS =
      EnumSet.of(IssueStatus.TODO, IssueStatus.IN_PROGRESS, IssueStatus.DONE);

  public IssueValidator(IssueRepository issueRepository) {
    this.issueRepository = issueRepository;
  }

  public void isIssueExists(Long issueId) {
    if (!issueRepository.existsByIdAndEntityStatus(issueId)) {
      throw new CoreException(CoreErrorType.ISSUE_NOT_FOUND);
    }
  }

  public void isValidImportance(Importance issueImportance) {
    if (!VALID_IMPORTANCES.contains(issueImportance)) {
      throw new CoreException(CoreErrorType.IMPORTANCE_NOT_VALID);
    }
  }

  public void isValidStatus(IssueStatus issueStatus) {
    if (!VALID_STATUS.contains(issueStatus)) {
      throw new CoreException(CoreErrorType.STATUS_NOT_VALID);
    }
  }
}

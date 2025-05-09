package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class IssueValidator {

  private final IssueRepository issueRepository;

  public IssueValidator(IssueRepository issueRepository) {
    this.issueRepository = issueRepository;
  }

  public void isIssueExists(Long issueId) {
    if (!issueRepository.existsByIdAndEntityStatus(issueId)) {
      throw new CoreException(CoreErrorType.ISSUE_NOT_FOUND);
    }
  }

  public void isBizpointPositive(Long bizPoint) {
    if (bizPoint <= 0) {
      throw new CoreException(CoreErrorType.BIZPOINT_NOT_POSITIVE);
    }
  }
}

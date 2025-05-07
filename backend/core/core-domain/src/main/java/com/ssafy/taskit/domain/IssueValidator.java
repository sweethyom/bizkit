package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class IssueValidator {
  public boolean isIssueExists(Long issueId) {
    return true;
  }
}

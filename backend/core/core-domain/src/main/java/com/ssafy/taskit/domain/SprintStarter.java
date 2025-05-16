package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SprintStarter {
  private final SprintRepository sprintRepository;

  private final SprintValidator sprintValidator;

  private final MemberValidator memberValidator;

  private final IssueRepository issueRepository;

  public SprintStarter(
      SprintRepository sprintRepository,
      SprintValidator sprintValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository) {
    this.sprintRepository = sprintRepository;
    this.sprintValidator = sprintValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
  }

  public void startSprint(User user, Long sprintId, StartSprint startSprint) {
    sprintValidator.isSprintExists(sprintId);
    Sprint sprint = sprintRepository
        .findSprint(sprintId)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));
    memberValidator.isProjectMember(user, sprint.projectId());
    sprintValidator.isReadySprint(sprintId);
    List<Issue> issues = issueRepository.findSprintIssues(sprintId);
    check(issues);
    if (startSprint.dueDate().isBefore(LocalDate.now())) {
      throw new CoreException(CoreErrorType.SPRINT_DUE_DATE_BEFORE_START);
    }
    sprintRepository.startSprint(sprintId, startSprint);
  }

  public void check(List<Issue> issues) {
    List<InvalidIssue> invalidIssues = issues.stream()
        .filter(issue -> !issue.isReadyToStart())
        .map(issue -> new InvalidIssue(issue.id(), issue.name(), issue.key()))
        .toList();

    if (!invalidIssues.isEmpty()) {
      throw new CoreException(CoreErrorType.SPRINT_HAS_NOT_VALID_ISSUES, invalidIssues);
    }
  }

  public record InvalidIssue(Long issueId, String name, String key) {}
}

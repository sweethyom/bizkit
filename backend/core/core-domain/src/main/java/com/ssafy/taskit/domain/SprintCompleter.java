package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SprintCompleter {

  private final SprintReader sprintReader;

  private final SprintRepository sprintRepository;

  private final SprintValidator sprintValidator;

  private final MemberValidator memberValidator;

  private final IssueReader issueReader;

  private final IssueModifier issueModifier;

  public SprintCompleter(
      SprintReader sprintReader,
      SprintRepository sprintRepository,
      SprintValidator sprintValidator,
      MemberValidator memberValidator,
      IssueReader issueReader,
      IssueModifier issueModifier) {
    this.sprintReader = sprintReader;
    this.sprintRepository = sprintRepository;
    this.sprintValidator = sprintValidator;
    this.memberValidator = memberValidator;
    this.issueReader = issueReader;
    this.issueModifier = issueModifier;
  }

  public void completeSprint(User user, Long sprintId, CompleteSprint completeSprint) {
    Sprint sprint = sprintReader.findSprint(sprintId);
    if (completeSprint.id() == null) {
      completeSprint = new CompleteSprint(0L);
    }
    sprintValidator.isSprintsInSameProject(sprintId, completeSprint.id());
    sprintValidator.isSprintsEquals(sprintId, completeSprint.id());
    memberValidator.validateMember(user, sprint.projectId());
    sprintValidator.isOngoingSprint(sprintId);

    List<Issue> issues = issueReader.readSprintIssues(user, sprintId).stream()
        .filter(issue -> issue.issueStatus() != IssueStatus.DONE)
        .toList();
    for (Issue issue : issues) {
      ModifyIssueSprint modifyIssueSprint = new ModifyIssueSprint(completeSprint.id());

      issueModifier.modifyIssueSprint(user, issue.id(), modifyIssueSprint);
    }

    sprintRepository.completeSprint(sprintId, completeSprint);
  }
}

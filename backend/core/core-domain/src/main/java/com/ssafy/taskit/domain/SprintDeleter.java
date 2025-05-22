package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SprintDeleter {

  private final SprintRepository sprintRepository;

  private final SprintValidator sprintValidator;

  private final MemberValidator memberValidator;

  private final SprintReader sprintReader;

  private final IssueRepository issueRepository;

  private final IssueService issueService;

  public SprintDeleter(
      SprintRepository sprintRepository,
      SprintValidator sprintValidator,
      MemberValidator memberValidator,
      SprintReader sprintReader,
      IssueRepository issueRepository,
      IssueService issueService) {
    this.sprintRepository = sprintRepository;
    this.sprintValidator = sprintValidator;
    this.memberValidator = memberValidator;
    this.sprintReader = sprintReader;
    this.issueRepository = issueRepository;
    this.issueService = issueService;
  }

  public void deleteSprint(User user, Long sprintId, IssueHandlingOption option) {
    sprintValidator.isSprintExists(sprintId);
    Sprint sprint = sprintReader.findSprint(sprintId);
    memberValidator.validateMember(user, sprint.projectId());
    sprintValidator.isNotOngoingSprint(sprintId);
    List<Issue> issues = issueRepository.findSprintIssues(sprintId);
    handleSprintIssues(user, issues, option);
    sprintRepository.deleteSprint(sprintId);
  }

  public void handleSprintIssues(User user, List<Issue> issues, IssueHandlingOption option) {
    switch (option) {
      case MOVE_TO_BACKLOG -> {
        for (Issue issue : issues) {
          issueService.modifyIssueSprint(user, issue.id(), new ModifyIssueSprint(null));
        }
      }
      case DELETE -> {
        for (Issue issue : issues) {
          issueService.deleteIssue(user, issue.id());
        }
      }
    }
  }
}

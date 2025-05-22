package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.util.List;

@org.springframework.stereotype.Component
public class IssueReader {

  private final EpicValidator epicValidator;
  private final MemberValidator memberValidator;
  private final IssueRepository issueRepository;
  private final EpicRepository epicRepository;
  private final SprintValidator sprintValidator;
  private final IssueValidator issueValidator;
  private final ComponentValidator componentValidator;
  private final ComponentRepository componentRepository;
  private final SprintRepository sprintRepository;

  public IssueReader(
      EpicValidator epicValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository,
      SprintValidator sprintValidator,
      IssueValidator issueValidator,
      ComponentValidator componentValidator,
      ComponentRepository componentRepository,
      SprintRepository sprintRepository) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
    this.sprintValidator = sprintValidator;
    this.issueValidator = issueValidator;
    this.componentValidator = componentValidator;
    this.componentRepository = componentRepository;
    this.sprintRepository = sprintRepository;
  }

  public List<Issue> readEpicIssues(User user, Long epicId) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.validateMember(user, epic.projectId());
    return issueRepository.findEpicIssues(epicId);
  }

  public List<Issue> readSprintIssues(User user, Long sprintId) {
    sprintValidator.isSprintExists(sprintId);
    Sprint sprint = sprintRepository.findById(sprintId);
    memberValidator.validateMember(user, sprint.projectId());
    return issueRepository.findSprintIssues(sprintId);
  }

  public Issue readIssue(User user, Long issueId) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.validateMember(user, epic.projectId());
    return issueRepository.findById(issueId);
  }

  public List<Issue> readComponentIssues(User user, Long projectId, Long componentId) {
    memberValidator.validateMember(user, projectId);

    if (componentId != null) {
      componentValidator.isComponentExists(componentId);
      Component component = componentRepository
          .findById(componentId)
          .orElseThrow(() -> new CoreException(CoreErrorType.COMPONENT_NOT_FOUND));
    }

    return issueRepository.findComponentIssues(projectId, componentId);
  }

  public List<Issue> readMyIssuesFirstPage(User user, IssueStatus issueStatus, Integer pageSize) {
    return issueRepository.findMyIssuesFirstPage(user.id(), issueStatus, pageSize);
  }

  public List<Issue> readMyIssues(
      User user, IssueStatus issueStatus, Long cursorId, Integer pageSize) {
    return issueRepository.findMyIssues(user.id(), issueStatus, cursorId, pageSize);
  }

  public List<Issue> readIssuesByUserId(Long assigneeId) {
    return issueRepository.findByUserId(assigneeId);
  }
}

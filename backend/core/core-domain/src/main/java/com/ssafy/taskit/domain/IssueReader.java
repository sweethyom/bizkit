package com.ssafy.taskit.domain;

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

  public IssueReader(
      EpicValidator epicValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository,
      SprintValidator sprintValidator,
      IssueValidator issueValidator,
      ComponentValidator componentValidator,
      ComponentRepository componentRepository) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
    this.sprintValidator = sprintValidator;
    this.issueValidator = issueValidator;
    this.componentValidator = componentValidator;
    this.componentRepository = componentRepository;
  }

  public List<Issue> readEpicIssues(User user, Long epicId) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.isProjectMember(user, epic.projectId());
    return issueRepository.findEpicIssues(epicId);
  }

  public List<Issue> readSprintIssues(User user, Long sprintId) {
    sprintValidator.isSprintExists(sprintId);
    //    TODO: sprint 완료되면 구현해야 함
    //    Sprint sprint = sprintRepository.findById(sprintId);
    //    memberValidator.isProjectMember(user, sprint.projectId());
    Long projectId = 1L;
    memberValidator.isProjectMember(user, projectId);
    return issueRepository.findSprintIssues(sprintId);
  }

  public Issue readIssue(User user, Long issueId) {
    issueValidator.isIssueExists(issueId);
    Issue issue = issueRepository.findById(issueId);
    Epic epic = epicRepository.findById(issue.epicId());
    memberValidator.isProjectMember(user, epic.projectId());
    return issueRepository.findById(issueId);
  }

  public List<Issue> readComponentIssues(User user, Long componentId) {
    if (componentId != null) {
      componentValidator.isComponentExists(componentId);
      //      TODO : component 완료되면 바꿔야 함
      //      Component component = componentRepository.findById(componentId);
      Component component = new Component(1L, 1L, 1L, "컴포넌트1", "컴포넌트 내용");
      memberValidator.isProjectMember(user, component.projectId());
    }
    return issueRepository.findComponentIssues(componentId);
  }

  public List<Issue> readMyIssuesFirstPage(User user, IssueStatus issueStatus, Integer pageSize) {
    return issueRepository.findMyIssuesFirstPage(user.id(), issueStatus, pageSize);
  }

  public List<Issue> readMyIssues(
      User user, IssueStatus issueStatus, Long cursorId, Integer pageSize) {
    return issueRepository.findMyIssues(user.id(), issueStatus, cursorId, pageSize);
  }
}

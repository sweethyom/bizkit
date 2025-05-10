package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class IssueReader {

  private final EpicValidator epicValidator;
  private final MemberValidator memberValidator;
  private final IssueRepository issueRepository;
  private final EpicRepository epicRepository;
  private final SprintValidator sprintValidator;

  public IssueReader(
      EpicValidator epicValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository,
      SprintValidator sprintValidator) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
    this.sprintValidator = sprintValidator;
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
}

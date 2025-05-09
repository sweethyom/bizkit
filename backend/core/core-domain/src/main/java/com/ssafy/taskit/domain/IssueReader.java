package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class IssueReader {

  private final EpicValidator epicValidator;
  private final MemberValidator memberValidator;
  private final IssueRepository issueRepository;
  private final EpicRepository epicRepository;

  public IssueReader(
      EpicValidator epicValidator,
      MemberValidator memberValidator,
      IssueRepository issueRepository,
      EpicRepository epicRepository) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.issueRepository = issueRepository;
    this.epicRepository = epicRepository;
  }

  public List<Issue> readEpicIssues(User user, Long epicId) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.isProjectMember(user, epic.projectId());
    return issueRepository.findEpicIssues(epicId);
  }
}

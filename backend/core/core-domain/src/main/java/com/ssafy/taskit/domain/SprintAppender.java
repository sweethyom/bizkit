package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class SprintAppender {

  private final SprintRepository sprintRepository;

  private final ProjectValidator projectValidator;

  private final MemberValidator memberValidator;

  public SprintAppender(
      SprintRepository sprintRepository,
      ProjectValidator projectValidator,
      MemberValidator memberValidator) {
    this.sprintRepository = sprintRepository;
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
  }

  public Sprint append(User user, Long projectId, NewSprint newSprint) {
    projectValidator.isProjectExists(projectId);
    memberValidator.validateMember(user, projectId);
    return sprintRepository.save(user, projectId, newSprint);
  }
}

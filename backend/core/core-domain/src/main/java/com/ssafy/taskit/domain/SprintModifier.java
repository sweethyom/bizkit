package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class SprintModifier {

  private final SprintRepository sprintRepository;

  private final SprintValidator sprintValidator;

  private final MemberValidator memberValidator;

  private final SprintReader sprintReader;

  public SprintModifier(
      SprintRepository sprintRepository,
      SprintValidator sprintValidator,
      MemberValidator memberValidator,
      SprintReader sprintReader) {
    this.sprintRepository = sprintRepository;
    this.sprintValidator = sprintValidator;
    this.memberValidator = memberValidator;
    this.sprintReader = sprintReader;
  }

  public void modifySprintName(User user, Long sprintId, ModifySprintName modifySprintName) {
    sprintValidator.isSprintExists(sprintId);
    Sprint sprint = sprintReader.findSprint(sprintId);
    memberValidator.isProjectMember(user, sprint.projectId());
    sprintRepository.modifySprintName(sprintId, modifySprintName);
  }
}

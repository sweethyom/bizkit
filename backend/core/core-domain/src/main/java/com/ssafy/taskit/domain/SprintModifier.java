package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
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
    memberValidator.validateNotMember(user, sprint.projectId());
    sprintRepository.modifySprintName(sprintId, modifySprintName);
  }

  public void modifySprintDueDate(
      User user, Long sprintId, ModifySprintDueDate modifySprintDueDate) {
    sprintValidator.isSprintExists(sprintId);
    Sprint sprint = sprintReader.findSprint(sprintId);
    memberValidator.validateNotMember(user, sprint.projectId());
    sprintValidator.isOngoingSprint(sprintId);
    if (sprint.dueDate().isBefore(sprint.startDate())) {
      throw new CoreException(CoreErrorType.SPRINT_DUE_DATE_BEFORE_START);
    }
    sprintRepository.modifySprintDueDate(sprintId, modifySprintDueDate);
  }
}

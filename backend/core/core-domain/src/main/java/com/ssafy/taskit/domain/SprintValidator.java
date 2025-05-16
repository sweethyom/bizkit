package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class SprintValidator {

  private final SprintRepository sprintRepository;

  public SprintValidator(SprintRepository sprintRepository) {
    this.sprintRepository = sprintRepository;
  }

  public void isSprintExists(Long sprintId) {
    //    boolean check = sprintRepository.findSprint(sprintId).isPresent();
    //    if (!check) {
    //      throw new CoreException(CoreErrorType.SPRINT_NOT_FOUND);
    //    }
    if (!sprintRepository.existsById(sprintId)) {
      throw new CoreException(CoreErrorType.SPRINT_NOT_FOUND);
    }
  }

  public void isOngoingSprint(Long sprintId) {
    Sprint sprint = sprintRepository
        .findSprint(sprintId)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));

    if (sprint.sprintStatus() != SprintStatus.ONGOING) {
      throw new CoreException(CoreErrorType.SPRINT_STATUS_IS_NOT_ONGOING);
    }
  }

  public void isNotOngoingSprint(Long sprintId) {
    Sprint sprint = sprintRepository
        .findSprint(sprintId)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));

    if (sprint.sprintStatus() == SprintStatus.ONGOING) {
      throw new CoreException(CoreErrorType.SPRINT_STATUS_IS_ONGOING);
    }
  }

  public void isReadySprint(Long sprintId) {
    Sprint sprint = sprintRepository
        .findSprint(sprintId)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));

    if (sprint.sprintStatus() != SprintStatus.READY) {
      throw new CoreException(CoreErrorType.SPRINT_STATUS_IS_NOT_READY);
    }
  }

  public void isCompletedSprint(Long sprintId) {
    Sprint sprint = sprintRepository
        .findSprint(sprintId)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));

    if (sprint.sprintStatus() == SprintStatus.COMPLETED) {
      throw new CoreException(CoreErrorType.SPRINT_STATUS_IS_COMPLETED);
    }
  }

  public void isSprintsInSameProject(Long fromSprintId, Long toSprintId) {
    Sprint fromSprint = sprintRepository
        .findSprint(fromSprintId)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));

    Sprint toSprint = sprintRepository
        .findSprint(toSprintId)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));

    if (!fromSprint.projectId().equals(toSprint.projectId())) {
      throw new CoreException(CoreErrorType.SPRINT_NOT_IN_SAME_PROJECT);
    }
  }

  public void isSprintsEquals(Long fromSprintId, Long toSprintId) {
    if (fromSprintId.equals(toSprintId)) {
      throw new CoreException(CoreErrorType.SPRINT_IS_EQUAL);
    }
  }
}

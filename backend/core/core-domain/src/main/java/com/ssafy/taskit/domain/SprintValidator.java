package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class SprintValidator {
  public boolean isSprintExists(Long sprintId) {
    return true;
  }

  public boolean isOngoingSprint(Long sprintId) {
    return true;
  }

  public boolean isReadySprint(Long sprintId) {
    return true;
  }

  public boolean isSprintsInSameProject(Long fromSprintId, Long toSprintId) {
    return true;
  }

  public boolean isSprintsEquals(Long fromSprintId, Long toSprintId) {
    return true;
  }
}

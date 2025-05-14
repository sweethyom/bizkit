package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SprintService {
  private final SprintAppender sprintAppender;
  private final SprintReader sprintReader;

  private final SprintModifier sprintModifier;

  public SprintService(
      SprintAppender sprintAppender, SprintReader sprintReader, SprintModifier sprintModifier) {
    this.sprintAppender = sprintAppender;
    this.sprintReader = sprintReader;
    this.sprintModifier = sprintModifier;
  }

  public Sprint append(User user, Long projectId, NewSprint newSprint) {
    return sprintAppender.append(user, projectId, newSprint);
  }

  public List<Sprint> findSprints(User user, Long projectId) {
    return sprintReader.findSprints(user, projectId);
  }

  public void modifySprintName(User user, Long sprintId, ModifySprintName modifySprintName) {
    sprintModifier.modifySprintName(user, sprintId, modifySprintName);
  }

  public void modifySprintDueDate(
      User user, Long sprintId, ModifySprintDueDate modifySprintDueDate) {
    sprintModifier.modifySprintDueDate(user, sprintId, modifySprintDueDate);
  }
}

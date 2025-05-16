package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SprintService {
  private final SprintAppender sprintAppender;
  private final SprintReader sprintReader;

  private final SprintModifier sprintModifier;

  private final SprintDeleter sprintDeleter;

  private final SprintStarter sprintStarter;

  public SprintService(
      SprintAppender sprintAppender,
      SprintReader sprintReader,
      SprintModifier sprintModifier,
      SprintDeleter sprintDeleter,
      SprintStarter sprintStarter) {
    this.sprintAppender = sprintAppender;
    this.sprintReader = sprintReader;
    this.sprintModifier = sprintModifier;
    this.sprintDeleter = sprintDeleter;
    this.sprintStarter = sprintStarter;
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

  public void deleteSprint(User user, Long sprintId, IssueHandlingOption option) {
    sprintDeleter.deleteSprint(user, sprintId, option);
  }

  public void startSprint(User user, Long sprintId, StartSprint startSprint) {
    sprintStarter.startSprint(user, sprintId, startSprint);
  }

  public Sprint findSprint(Long sprintId) {
    if (sprintId == null) {
      return Sprint.toEmpty();
    }
    return sprintReader.findSprint(sprintId);
  }
}

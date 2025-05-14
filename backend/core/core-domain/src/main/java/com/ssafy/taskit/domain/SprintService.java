package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SprintService {
  private final SprintAppender sprintAppender;
  private final SprintReader sprintReader;

  private final SprintModifier sprintModifier;

  private final SprintDeleter sprintDeleter;

  public SprintService(
      SprintAppender sprintAppender,
      SprintReader sprintReader,
      SprintModifier sprintModifier,
      SprintDeleter sprintDeleter) {
    this.sprintAppender = sprintAppender;
    this.sprintReader = sprintReader;
    this.sprintModifier = sprintModifier;
    this.sprintDeleter = sprintDeleter;
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

  public Sprint findSprint(Long sprintId) {
    return sprintReader.findSprint(sprintId);
  }
}

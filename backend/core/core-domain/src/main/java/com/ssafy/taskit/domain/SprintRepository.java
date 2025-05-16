package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Optional;

public interface SprintRepository {

  Sprint save(User user, Long projectId, NewSprint newSprint);

  List<Sprint> findSprints(Long projectId);

  void modifySprintName(Long sprintId, ModifySprintName modifySprintName);

  Optional<Sprint> findSprint(Long sprintId);

  void modifySprintDueDate(Long sprintId, ModifySprintDueDate modifySprintDueDate);

  void deleteSprint(Long sprintId);

  void startSprint(Long sprintId, StartSprint startSprint);

  Sprint findById(Long sprintId);

  boolean existsById(Long sprintId);
}

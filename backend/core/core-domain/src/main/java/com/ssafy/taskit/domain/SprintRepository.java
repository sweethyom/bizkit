package com.ssafy.taskit.domain;

import java.util.List;
import java.util.Optional;

public interface SprintRepository {

  Sprint save(User user, Long projectId, NewSprint newSprint);

  List<Sprint> findSprints(Long projectId);

  void modifySprintName(Long sprintId, ModifySprintName modifySprintName);

  Optional<Sprint> findSprint(Long sprintId);
}

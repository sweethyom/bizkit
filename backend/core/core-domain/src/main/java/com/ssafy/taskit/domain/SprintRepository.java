package com.ssafy.taskit.domain;

import java.util.List;

public interface SprintRepository {

  Sprint save(User user, Long projectId, NewSprint newSprint);

  List<Sprint> findSprints(Long projectId);
}

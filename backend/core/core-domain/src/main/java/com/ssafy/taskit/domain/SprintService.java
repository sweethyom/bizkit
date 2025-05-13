package com.ssafy.taskit.domain;

import org.springframework.stereotype.Service;

@Service
public class SprintService {
  private final SprintAppender sprintAppender;

  private final SprintRepository sprintRepository;

  public SprintService(SprintAppender sprintAppender, SprintRepository sprintRepository) {
    this.sprintAppender = sprintAppender;
    this.sprintRepository = sprintRepository;
  }

  public Sprint append(User user, Long projectId, NewSprint newSprint) {
    return sprintAppender.append(user, projectId, newSprint);
  }
}

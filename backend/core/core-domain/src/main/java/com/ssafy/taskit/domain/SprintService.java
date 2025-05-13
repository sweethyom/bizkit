package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SprintService {
  private final SprintAppender sprintAppender;
  private final SprintReader sprintReader;

  private final SprintRepository sprintRepository;

  public SprintService(
      SprintAppender sprintAppender, SprintReader sprintReader, SprintRepository sprintRepository) {
    this.sprintAppender = sprintAppender;
    this.sprintReader = sprintReader;
    this.sprintRepository = sprintRepository;
  }

  public Sprint append(User user, Long projectId, NewSprint newSprint) {
    return sprintAppender.append(user, projectId, newSprint);
  }

  public List<Sprint> findSprints(User user, Long projectId) {
    return sprintReader.findSprints(user, projectId);
  }
}

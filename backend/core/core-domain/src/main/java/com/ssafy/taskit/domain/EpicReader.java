package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class EpicReader {

  private final ProjectValidator projectValidator;
  private final MemberValidator memberValidator;
  private final EpicRepository epicRepository;

  public EpicReader(
      ProjectValidator projectValidator,
      MemberValidator memberValidator,
      EpicRepository epicRepository) {
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
    this.epicRepository = epicRepository;
  }

  public List<Epic> readEpics(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectMember(user, projectId);
    return epicRepository.findEpics(projectId);
  }
}

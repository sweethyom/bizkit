package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class EpicReader {

  private final ProjectValidator projectValidator;
  private final MemberValidator memberValidator;
  private final EpicRepository epicRepository;
  private final EpicValidator epicValidator;

  public EpicReader(
      ProjectValidator projectValidator,
      MemberValidator memberValidator,
      EpicRepository epicRepository,
      EpicValidator epicValidator) {
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
    this.epicRepository = epicRepository;
    this.epicValidator = epicValidator;
  }

  public List<Epic> readEpics(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectMember(user, projectId);
    return epicRepository.findEpics(projectId);
  }

  public Epic readEpic(User user, Long epicId) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.isProjectMember(user, epic.projectId());
    return epicRepository.findById(epicId);
  }

  public List<Epic> readEpics(List<Long> epicIds) {
    return epicRepository.findAllByIds(epicIds);
  }
}

package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class EpicAppender {

  private final ProjectValidator projectValidator;
  private final MemberValidator memberValidator;
  private final EpicRepository epicRepository;

  public EpicAppender(
      ProjectValidator projectValidator,
      MemberValidator memberValidator,
      EpicRepository epicRepository) {
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
    this.epicRepository = epicRepository;
  }

  public Epic append(User user, Long projectId, NewEpic newEpic, String key) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectMember(user, projectId);
    return epicRepository.save(projectId, newEpic, key);
  }
}

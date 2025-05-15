package com.ssafy.taskit.domain;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

@Component
public class EpicAppender {

  private final ProjectValidator projectValidator;
  private final MemberValidator memberValidator;
  private final EpicRepository epicRepository;
  private final KeyGenerator keyGenerator;

  public EpicAppender(
      ProjectValidator projectValidator,
      MemberValidator memberValidator,
      EpicRepository epicRepository,
      KeyGenerator keyGenerator) {
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
    this.epicRepository = epicRepository;
    this.keyGenerator = keyGenerator;
  }

  @Transactional
  public Epic append(User user, Long projectId, NewEpic newEpic) {
    projectValidator.isProjectExists(projectId);
    memberValidator.validateNotMember(user, projectId);
    String key = keyGenerator.generateKey(projectId);
    return epicRepository.save(projectId, newEpic, key);
  }
}

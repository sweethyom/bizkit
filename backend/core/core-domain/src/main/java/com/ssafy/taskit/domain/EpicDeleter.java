package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class EpicDeleter {

  private final EpicValidator epicValidator;
  private final MemberValidator memberValidator;
  private final EpicRepository epicRepository;

  public EpicDeleter(
      EpicValidator epicValidator, MemberValidator memberValidator, EpicRepository epicRepository) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.epicRepository = epicRepository;
  }

  public void deleteEpic(User user, Long epicId) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.validateMember(user, epic.projectId());
    epicRepository.deleteEpic(epicId);
  }
}

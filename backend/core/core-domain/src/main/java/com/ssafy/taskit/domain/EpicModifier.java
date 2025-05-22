package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class EpicModifier {

  private final EpicValidator epicValidator;
  private final MemberValidator memberValidator;
  private final EpicRepository epicRepository;

  public EpicModifier(
      EpicValidator epicValidator, MemberValidator memberValidator, EpicRepository epicRepository) {
    this.epicValidator = epicValidator;
    this.memberValidator = memberValidator;
    this.epicRepository = epicRepository;
  }

  public void modifyEpic(User user, Long epicId, ModifyEpic modifyEpic) {
    epicValidator.isEpicExists(epicId);
    Epic epic = epicRepository.findById(epicId);
    memberValidator.validateMember(user, epic.projectId());
    epicRepository.modifyEpic(epicId, modifyEpic);
  }
}

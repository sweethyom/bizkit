package com.ssafy.taskit.domain;

import java.util.List;

public class ComponentReader {

  private final ProjectValidator projectValidator;

  private final MemberValidator memberValidator;
  private final ComponentRepository componentRepository;

  public ComponentReader(
      ComponentRepository componentRepository,
      ProjectValidator projectValidator,
      MemberValidator memberValidator) {
    this.componentRepository = componentRepository;
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
  }

  public List<Component> findComponents(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectMember(user, projectId);

    return componentRepository.findComponents(projectId);
  }
}

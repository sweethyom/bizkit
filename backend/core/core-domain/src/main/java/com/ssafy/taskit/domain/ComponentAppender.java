package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class ComponentAppender {
  private final ComponentRepository componentRepository;

  private final ComponentValidator componentValidator;

  private final ProjectValidator projectValidator;

  private final MemberValidator memberValidator;

  public ComponentAppender(
      ComponentRepository componentRepository,
      ComponentValidator componentValidator,
      ProjectValidator projectValidator,
      MemberValidator memberValidator) {
    this.componentRepository = componentRepository;
    this.componentValidator = componentValidator;
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
  }

  public com.ssafy.taskit.domain.Component append(
      User user, Long projectId, NewComponent newComponent) {
    projectValidator.isProjectExists(projectId);
    componentValidator.isComponentNameLimitOver(newComponent.name());
    componentValidator.isUniqueComponent(projectId, newComponent.name());
    componentValidator.isComponentContentLimitOver(newComponent.content());
    memberValidator.isProjectLeader(user, projectId);

    return componentRepository.save(user, projectId, newComponent);
  }
}

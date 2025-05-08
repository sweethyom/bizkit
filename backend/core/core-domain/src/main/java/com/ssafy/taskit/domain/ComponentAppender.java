package com.ssafy.taskit.domain;

@org.springframework.stereotype.Component
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

  public Component append(User user, Long projectId, NewComponent newComponent) {
    projectValidator.isProjectExists(projectId);
    componentValidator.isUniqueComponent(projectId, newComponent.name());
    memberValidator.isProjectLeader(user, projectId);

    return componentRepository.save(user, projectId, newComponent);
  }
}

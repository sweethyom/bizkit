package com.ssafy.taskit.domain;

@org.springframework.stereotype.Component
public class ComponentModifier {

  private final ComponentRepository componentRepository;

  private final ComponentValidator componentValidator;

  private final MemberValidator memberValidator;

  public ComponentModifier(
      ComponentRepository componentRepository,
      ComponentValidator componentValidator,
      MemberValidator memberValidator) {
    this.componentRepository = componentRepository;
    this.componentValidator = componentValidator;
    this.memberValidator = memberValidator;
  }

  public void modify(User user, Long componentId, ModifyComponent modifyComponent) {
    componentValidator.isComponentExists(componentId);
    Component component = componentRepository.findById(componentId);
    componentValidator.isUniqueComponent(component.projectId(), modifyComponent.name());
    memberValidator.isProjectLeader(user, component.projectId());
    componentRepository.modifyComponent(componentId, modifyComponent);
  }
}

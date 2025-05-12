package com.ssafy.taskit.domain;

@org.springframework.stereotype.Component
public class ComponentModifier {

  private final ComponentRepository componentRepository;

  private final ComponentValidator componentValidator;

  private final MemberValidator memberValidator;

  private final ComponentReader componentReader;

  public ComponentModifier(
      ComponentRepository componentRepository,
      ComponentValidator componentValidator,
      MemberValidator memberValidator,
      ComponentReader componentReader) {
    this.componentRepository = componentRepository;
    this.componentValidator = componentValidator;
    this.memberValidator = memberValidator;
    this.componentReader = componentReader;
  }

  public void modify(User user, Long componentId, ModifyComponent modifyComponent) {
    componentValidator.isComponentExists(componentId);
    Component component = componentReader.findComponent(componentId);
    componentValidator.isUniqueComponent(component.projectId(), modifyComponent.name());
    memberValidator.isProjectLeader(user, component.projectId());
    componentRepository.modifyComponent(componentId, modifyComponent);
  }
}

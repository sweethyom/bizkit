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

  public void modifyComponentName(
      User user, Long componentId, ModifyComponentName modifyComponentName) {
    componentValidator.isComponentExists(componentId);
    Component component = componentReader.findComponent(componentId);
    componentValidator.isUniqueComponentNameForModify(
        component.projectId(), componentId, modifyComponentName.name());
    memberValidator.isProjectLeader(user, component.projectId());
    componentRepository.modifyComponentName(componentId, modifyComponentName);
  }

  public void modifyComponentContent(
      User user, Long componentId, ModifyComponentContent modifyComponentContent) {
    componentValidator.isComponentExists(componentId);
    Component component = componentReader.findComponent(componentId);
    memberValidator.isProjectLeader(user, component.projectId());
    componentRepository.modifyComponentContent(componentId, modifyComponentContent);
  }
}

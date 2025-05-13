package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ComponentService {
  private final ComponentAppender componentAppender;

  private final ComponentReader componentReader;

  private final ComponentDeleter componentDeleter;

  private final ComponentModifier componentModifier;
  private final ProjectValidator projectValidator;
  private final MemberValidator memberValidator;

  private final ComponentValidator componentValidator;

  public ComponentService(
      ComponentAppender componentAppender,
      ComponentReader componentReader,
      ComponentModifier componentModifier,
      ComponentDeleter componentDeleter,
      ProjectValidator projectValidator,
      MemberValidator memberValidator,
      ComponentValidator componentValidator) {
    this.componentAppender = componentAppender;
    this.componentReader = componentReader;
    this.componentModifier = componentModifier;
    this.componentDeleter = componentDeleter;
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
    this.componentValidator = componentValidator;
  }

  public Component append(User user, Long projectId, NewComponent newComponent) {
    return componentAppender.append(user, projectId, newComponent);
  }

  public List<Component> findComponents(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectMember(user, projectId);
    return componentReader.findComponents(projectId);
  }

  public void modifyComponent(User user, Long componentId, ModifyComponent modifyComponent) {
    componentModifier.modify(user, componentId, modifyComponent);
  }

  public void deleteComponent(User user, Long componentId) {
    componentValidator.isComponentExists(componentId);
    Component component = componentReader.findComponent(componentId);
    memberValidator.isProjectMember(user, component.projectId());
    componentDeleter.delete(componentId);
  }
}

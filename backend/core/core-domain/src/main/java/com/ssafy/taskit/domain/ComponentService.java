package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ComponentService {
  private final ComponentAppender componentAppender;

  private final ComponentReader componentReader;

  private final ComponentModifier componentModifier;

  public ComponentService(
      ComponentAppender componentAppender,
      ComponentReader componentReader,
      ComponentModifier componentModifier) {
    this.componentAppender = componentAppender;
    this.componentReader = componentReader;
    this.componentModifier = componentModifier;
  }

  public Component append(User user, Long projectId, NewComponent newComponent) {
    return componentAppender.append(user, projectId, newComponent);
  }

  public List<Component> findComponents(User user, Long projectId) {
    return componentReader.findComponents(user, projectId);
  }

  public void modifyComponent(User user, Long componentId, ModifyComponent modifyComponent) {
    componentModifier.modify(user, componentId, modifyComponent);
  }
}

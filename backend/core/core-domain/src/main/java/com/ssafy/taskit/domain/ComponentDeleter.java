package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;

@org.springframework.stereotype.Component
public class ComponentDeleter {
  private final ComponentRepository componentRepository;

  public ComponentDeleter(ComponentRepository componentRepository) {
    this.componentRepository = componentRepository;
  }

  public Component delete(Long componentId) {
    return componentRepository
        .deleteComponent(componentId)
        .orElseThrow(() -> new CoreException(CoreErrorType.COMPONENT_NOT_FOUND));
  }
}

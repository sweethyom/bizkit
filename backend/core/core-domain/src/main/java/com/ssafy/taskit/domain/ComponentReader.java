package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.util.List;

@org.springframework.stereotype.Component
public class ComponentReader {

  private final ComponentRepository componentRepository;

  public ComponentReader(ComponentRepository componentRepository) {
    this.componentRepository = componentRepository;
  }

  public List<Component> findComponents(Long projectId) {
    return componentRepository.findComponents(projectId);
  }

  public Component findComponent(Long componentId) {
    return componentRepository
        .findById(componentId)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
  }
}

package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class ComponentValidator {

  private final ComponentRepository componentRepository;

  public ComponentValidator(ComponentRepository componentRepository) {
    this.componentRepository = componentRepository;
  }

  public void isUniqueComponent(Long projectId, String name) {
    boolean check = componentRepository.existsByProjectIdAndName(projectId, name);
    if (check) {
      throw new CoreException(CoreErrorType.DUPLICATED_COMPONENT_NAME);
    }
  }

  public boolean isComponentExists(Long componentId) {
    return true;
  }

  public boolean isComponentInProject(Long componentId, Long projectId) {
    return true;
  }
}

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

  public void isUniqueComponentNameForCreate(Long projectId, String name) {
    boolean check = componentRepository.existsByProjectIdAndName(projectId, name);
    if (check) {
      throw new CoreException(CoreErrorType.DUPLICATED_COMPONENT_NAME);
    }
  }

  public void isUniqueComponentNameForModify(Long projectId, Long componentId, String name) {
    componentRepository.findByProjectIdAndName(projectId, name).ifPresent(component -> {
      if (!component.id().equals(componentId)) {
        throw new CoreException(CoreErrorType.DUPLICATED_COMPONENT_NAME);
      }
    });
  }

  public void isComponentExists(Long componentId) {
    boolean check = componentRepository.findById(componentId).isPresent();
    if (!check) {
      throw new CoreException(CoreErrorType.COMPONENT_NOT_FOUND);
    }
  }

  public void isComponentInProject(Long componentId, Long projectId) {
    boolean check = componentRepository.existsByIdAndProjectId(componentId, projectId);
    if (!check) {
      throw new CoreException(CoreErrorType.COMPONENT_NOT_IN_PROJECT);
    }
  }
}

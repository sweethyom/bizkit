package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class ComponentValidator {
  public boolean isUniqueComponentName(Long projectId, String name) {
    return true;
  }

  public boolean isComponentExists(Long componentId) {
    return true;
  }

  public boolean isComponentInProject(Long componentId, Long projectId) {
    return true;
  }
}

package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;

@Component
public class ComponentValidator {

  private final ComponentRepository componentRepository;

  public ComponentValidator(ComponentRepository componentRepository) {
    this.componentRepository = componentRepository;
  }

  public void isUniqueComponentName(Long projectId, String name) {
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

  public void isComponentNameLimitOver(String name) {
    int bytes = name.getBytes(StandardCharsets.UTF_8).length;
    if (bytes > 20) {
      throw new CoreException(CoreErrorType.NAME_LENGTH_LIMIT_OVER);
    }
  }

  public void isComponentContentLimitOver(String content) {
    int bytes = content.getBytes(StandardCharsets.UTF_8).length;
    if (bytes > 100) {
      throw new CoreException(CoreErrorType.NAME_LENGTH_LIMIT_OVER);
    }
  }
}

package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ComponentService {
  private final ComponentAppender componentAppender;

  private final ComponentReader componentReader;

  public ComponentService(ComponentAppender componentAppender, ComponentReader componentReader) {
    this.componentAppender = componentAppender;
    this.componentReader = componentReader;
  }

  public Component append(User user, Long projectId, NewComponent newComponent) {
    return componentAppender.append(user, projectId, newComponent);
  }

  public List<Component> findComponents(User user, Long projectId) {
    return componentReader.findComponents(user, projectId);
  }
}

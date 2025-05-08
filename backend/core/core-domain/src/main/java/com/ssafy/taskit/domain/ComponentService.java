package com.ssafy.taskit.domain;

import org.springframework.stereotype.Service;

@Service
public class ComponentService {
  private final ComponentAppender componentAppender;

  public ComponentService(ComponentAppender componentAppender) {
    this.componentAppender = componentAppender;
  }

  public Component append(User user, Long projectId, NewComponent newComponent) {
    return componentAppender.append(user, projectId, newComponent);
  }
}

package com.ssafy.taskit.domain;

@org.springframework.stereotype.Component
public class ComponentDeleter {
  private final ComponentRepository componentRepository;

  public ComponentDeleter(ComponentRepository componentRepository) {
    this.componentRepository = componentRepository;
  }

  public void delete(Long componentId) {
    componentRepository.deleteComponent(componentId);
  }
}

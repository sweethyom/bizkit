package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Component;
import java.util.List;

public record ComponentDetailResponse(Long id, String name, String content) {

  public static List<ComponentDetailResponse> of(List<Component> components) {
    return components.stream()
        .map(component ->
            new ComponentDetailResponse(component.id(), component.name(), component.content()))
        .toList();
  }
}

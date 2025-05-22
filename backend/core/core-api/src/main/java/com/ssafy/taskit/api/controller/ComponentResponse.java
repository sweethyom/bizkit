package com.ssafy.taskit.api.controller;

import com.ssafy.taskit.domain.Component;

public record ComponentResponse(Long id, String name) {
  public static ComponentResponse from(Component component) {
    return new ComponentResponse(component.id(), component.name());
  }
}

package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class ProjectValidator {
  public boolean isProjectExists(Long projectId) {
    return true;
  }
}

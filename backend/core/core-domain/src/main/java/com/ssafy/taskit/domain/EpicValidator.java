package com.ssafy.taskit.domain;

import org.springframework.stereotype.Component;

@Component
public class EpicValidator {
  public boolean isEpicExists(Long epicId) {
    return true;
  }

  public boolean isEpicInProject(Long epicId, Long projectId) {
    return true;
  }
}

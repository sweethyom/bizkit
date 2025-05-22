package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import org.springframework.stereotype.Component;

@Component
public class EpicValidator {

  private final EpicRepository epicRepository;

  public EpicValidator(EpicRepository epicRepository) {
    this.epicRepository = epicRepository;
  }

  public void isEpicExists(Long epicId) {
    if (!epicRepository.existsById(epicId)) {
      throw new CoreException(CoreErrorType.DATA_NOT_FOUND);
    }
  }

  public void isEpicInProject(Long newEpicId, Long projectId) {
    Epic newEpic = epicRepository.findById(newEpicId);
    if (!newEpic.projectId().equals(projectId)) {
      throw new CoreException(CoreErrorType.EPIC_NOT_IN_PROJECT);
    }
  }
}

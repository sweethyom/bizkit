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

  public boolean isEpicInProject(Long epicId, Long projectId) {
    return true;
  }
}

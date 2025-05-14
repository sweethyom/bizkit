package com.ssafy.taskit.domain;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SprintReader {

  private final SprintRepository sprintRepository;

  private final ProjectValidator projectValidator;
  private final MemberValidator memberValidator;

  public SprintReader(
      SprintRepository sprintRepository,
      ProjectValidator projectValidator,
      MemberValidator memberValidator) {
    this.sprintRepository = sprintRepository;
    this.projectValidator = projectValidator;
    this.memberValidator = memberValidator;
  }

  public List<Sprint> findSprints(User user, Long projectId) {
    projectValidator.isProjectExists(projectId);
    memberValidator.isProjectMember(user, projectId);
    return sprintRepository.findSprints(projectId);
  }

  public Sprint findSprint(Long sprintId) {
    return sprintRepository
        .findSprint(sprintId)
        .orElseThrow(() -> new CoreException(CoreErrorType.SPRINT_NOT_FOUND));
  }
}

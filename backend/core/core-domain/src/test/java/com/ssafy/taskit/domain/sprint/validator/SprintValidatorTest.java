package com.ssafy.taskit.domain.sprint.validator;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintRepository;
import com.ssafy.taskit.domain.SprintStatus;
import com.ssafy.taskit.domain.SprintValidator;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SprintValidatorTest {

  private SprintRepository sprintRepository;

  private SprintValidator sprintValidator;

  @BeforeEach
  void setup() {
    sprintRepository = mock(SprintRepository.class);
    sprintValidator = new SprintValidator(sprintRepository);
  }

  @Test
  void isReadySprint_whenSprintStatusIsReady_doesNotThrow() {
    Sprint sprint = mock(Sprint.class);
    when(sprint.sprintStatus()).thenReturn(SprintStatus.READY);
    when(sprintRepository.findSprint(1L)).thenReturn(Optional.of(sprint));

    // then
    assertDoesNotThrow(() -> sprintValidator.isReadySprint(1L));
  }

  @Test
  void isOngoingSprintAlreadyExist_whenOngoingSprintNotExist_doesNotThrow() {

    Long projectId = 1L;
    when(sprintRepository.existsOngoingSprint(projectId)).thenReturn(false);

    assertDoesNotThrow(() -> sprintValidator.isOngoingSprintAlreadyExist(projectId));
  }

  @Test
  void isSprintExists_whenSprintExists_doesNotThrow() {

    Long sprintId = 1L;
    when(sprintRepository.existsById(sprintId)).thenReturn(true);

    assertDoesNotThrow(() -> sprintValidator.isSprintExists(sprintId));
  }

  @Test
  void isSprintsInSameProject_whenSprintsInSameProject_doesNotThrow() {

    Long fromSprintId = 1L;
    Long toSprintId = 2L;
    Sprint fromSprint = mock(Sprint.class);
    Sprint toSprint = mock(Sprint.class);

    when(fromSprint.projectId()).thenReturn(1L);
    when(toSprint.projectId()).thenReturn(1L);
    //    when(toSprint.projectId()).thenReturn(2L);

    when(sprintRepository.findSprint(fromSprintId)).thenReturn(Optional.of(fromSprint));
    when(sprintRepository.findSprint(toSprintId)).thenReturn(Optional.of(toSprint));
    //    when(sprintRepository.findSprint(toSprintId)).thenReturn(Optional.empty());

    assertDoesNotThrow(() -> sprintValidator.isSprintsInSameProject(fromSprintId, toSprintId));
  }

  @Test
  void isSprintsEquals_whenIdsAreDifferent_doesNotThrow() {

    Long fromId = 1L;
    Long toId = 2L;
    //    Long toId = 1L;

    assertDoesNotThrow(() -> sprintValidator.isSprintsEquals(fromId, toId));
  }

  @Test
  void isOngoingSprint_whenSprintStatusIsOngoing_doesNotThrow() {

    Long sprintId = 1L;
    Sprint sprint = mock(Sprint.class);
    //    when(sprint.sprintStatus()).thenReturn(SprintStatus.READY);
    when(sprint.sprintStatus()).thenReturn(SprintStatus.ONGOING);
    //    when(sprint.sprintStatus()).thenReturn(SprintStatus.COMPLETED);
    when(sprintRepository.findSprint(sprintId)).thenReturn(Optional.of(sprint));
    //    when(sprintRepository.findSprint(sprintId)).thenReturn(Optional.empty());

    assertDoesNotThrow(() -> sprintValidator.isOngoingSprint(sprintId));
  }
}

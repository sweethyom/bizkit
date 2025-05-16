package com.ssafy.taskit.api.validator;

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
}

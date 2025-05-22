package com.ssafy.taskit.domain.error;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

class CoreErrorTypeTest {

  @Test
  void test() {
    List<Long> ids = List.of(1L, 2L, 3L);
    CoreException coreException = new CoreException(CoreErrorType.SPRINT_HAS_NOT_VALID_ISSUES, ids);
    Assertions.assertThat(coreException.getMessage()).contains(ids.toString());
  }
}

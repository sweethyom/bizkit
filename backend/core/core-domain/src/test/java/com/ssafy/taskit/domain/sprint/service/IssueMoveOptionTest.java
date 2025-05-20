package com.ssafy.taskit.domain.sprint.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.ssafy.taskit.domain.IssueMoveOption;
import org.junit.jupiter.api.Test;

class IssueMoveOptionTest {

  @Test
  void bothTrue() {
    assertThat(IssueMoveOption.from(true, true)).isEqualTo(IssueMoveOption.STATUS_AND_COMPONENT);
  }

  @Test
  void componentOnly() {
    assertThat(IssueMoveOption.from(true, false)).isEqualTo(IssueMoveOption.COMPONENT_ONLY);
  }

  @Test
  void statusOnly() {
    assertThat(IssueMoveOption.from(false, true)).isEqualTo(IssueMoveOption.STATUS_ONLY);
  }

  @Test
  void noChange() {
    assertThat(IssueMoveOption.from(false, false)).isEqualTo(IssueMoveOption.NO_CHANGE);
  }
}

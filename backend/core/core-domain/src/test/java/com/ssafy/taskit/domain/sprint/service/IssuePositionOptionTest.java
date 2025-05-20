package com.ssafy.taskit.domain.sprint.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.ssafy.taskit.domain.IssuePositionOption;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class IssuePositionOptionTest {

  @Nested
  class FromMethod {

    @Test
    void from_Between() {
      Double before = 1000.0;
      Double after = 2000.0;

      IssuePositionOption result = IssuePositionOption.from(before, after);

      assertThat(result).isEqualTo(IssuePositionOption.BETWEEN);
    }

    @Test
    void from_After() {
      Double before = 1000.0;
      Double after = null;

      IssuePositionOption result = IssuePositionOption.from(before, after);

      assertThat(result).isEqualTo(IssuePositionOption.AFTER);
    }

    @Test
    void from_Before() {
      Double before = null;
      Double after = 2000.0;

      IssuePositionOption result = IssuePositionOption.from(before, after);

      assertThat(result).isEqualTo(IssuePositionOption.BEFORE);
    }

    @Test
    void from_Nothing() {
      IssuePositionOption result = IssuePositionOption.from(null, null);

      assertThat(result).isEqualTo(IssuePositionOption.NOTHING);
    }
  }

  @Nested
  class CalculateMethod {

    @Test
    void calculate_Between() {
      double result = IssuePositionOption.BETWEEN.calculate(1000.0, 2000.0);

      assertThat(result).isEqualTo(1500.0);
    }

    @Test
    void calculate_AfterNull() {
      double result = IssuePositionOption.AFTER.calculate(3000.0, null);

      assertThat(result).isEqualTo(4000.0);
    }

    @Test
    void calculate_BeforeNull() {
      double result = IssuePositionOption.BEFORE.calculate(null, 1000.0);

      assertThat(result).isEqualTo(500.0);
    }

    @Test
    @DisplayName("NOTHING 계산")
    void calculate_Nothing() {
      double result = IssuePositionOption.NOTHING.calculate(null, null);

      assertThat(result).isEqualTo(1000.0);
    }
  }
}

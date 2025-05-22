package com.ssafy.taskit.domain.sprint.service;

import static com.ssafy.taskit.domain.IssueStatus.DONE;
import static com.ssafy.taskit.domain.IssueStatus.TODO;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueMoveDecisioner;
import com.ssafy.taskit.domain.IssueMoveOption;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.MoveSprintIssue;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class IssueMoveDecisionerTest {

  private final Long defaultComponentId = 1L;

  private Issue dummyIssue(Long componentId, IssueStatus issueStatus) {
    return new Issue(
        1L,
        "테스트",
        "테스트용",
        "ABCD",
        2L,
        Importance.LOW,
        issueStatus,
        componentId,
        null,
        null,
        null,
        2000.0,
        new DefaultDateTime(null, null));
  }

  @Nested
  class OfMethod {

    @Test
    void statusOnlyChanged() {
      Issue issue = dummyIssue(defaultComponentId, TODO);
      MoveSprintIssue move = new MoveSprintIssue(1L, defaultComponentId, DONE, null, null);

      IssueMoveDecisioner issueMoveDecision = IssueMoveDecisioner.of(issue, move);

      assertThat(issueMoveDecision.toMoveType()).isEqualTo(IssueMoveOption.STATUS_ONLY);
    }

    @Test
    void componentOnlyChanged() {
      Issue issue = dummyIssue(defaultComponentId, TODO);
      MoveSprintIssue move = new MoveSprintIssue(1L, 2L, TODO, null, null);

      IssueMoveDecisioner issueMoveDecision = IssueMoveDecisioner.of(issue, move);

      assertThat(issueMoveDecision.toMoveType()).isEqualTo(IssueMoveOption.COMPONENT_ONLY);
    }

    @Test
    void bothChanged() {
      Issue issue = dummyIssue(defaultComponentId, TODO);
      MoveSprintIssue move = new MoveSprintIssue(1L, 2L, DONE, null, null);

      IssueMoveDecisioner issueMoveDecision = IssueMoveDecisioner.of(issue, move);

      assertThat(issueMoveDecision.toMoveType()).isEqualTo(IssueMoveOption.STATUS_AND_COMPONENT);
    }

    @Test
    void noChange() {
      Issue issue = dummyIssue(defaultComponentId, TODO);
      MoveSprintIssue move = new MoveSprintIssue(1L, defaultComponentId, TODO, null, null);

      IssueMoveDecisioner issueMoveDecision = IssueMoveDecisioner.of(issue, move);

      assertThat(issueMoveDecision.toMoveType()).isEqualTo(IssueMoveOption.NO_CHANGE);
    }
  }
}

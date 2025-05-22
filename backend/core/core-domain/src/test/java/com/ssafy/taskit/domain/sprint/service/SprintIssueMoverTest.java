package com.ssafy.taskit.domain.sprint.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueModifier;
import com.ssafy.taskit.domain.IssueReader;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.MemberValidator;
import com.ssafy.taskit.domain.ModifyIssueComponent;
import com.ssafy.taskit.domain.ModifyIssueStatus;
import com.ssafy.taskit.domain.MoveSprintIssue;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintIssueMover;
import com.ssafy.taskit.domain.SprintReader;
import com.ssafy.taskit.domain.SprintStatus;
import com.ssafy.taskit.domain.SprintValidator;
import com.ssafy.taskit.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SprintIssueMoverTest {

  private IssueReader issueReader;
  private SprintValidator sprintValidator;
  private MemberValidator memberValidator;
  private IssueModifier issueModifier;
  private SprintReader sprintReader;
  private SprintIssueMover sprintIssueMover;

  @BeforeEach
  void setUp() {
    issueReader = mock(IssueReader.class);
    sprintValidator = mock(SprintValidator.class);
    memberValidator = mock(MemberValidator.class);
    issueModifier = mock(IssueModifier.class);
    sprintReader = mock(SprintReader.class);

    sprintIssueMover = new SprintIssueMover(
        issueReader, sprintValidator, memberValidator, issueModifier, sprintReader);
  }

  @Test
  void moveSprintIssue_statusOnlyChanged_doesNotThrow() {

    User user = new User(1L);
    Long sprintId = 1L;

    Issue issue = new Issue(
        1L,
        "이슈",
        "내용",
        "KEY",
        1L,
        Importance.HIGH,
        IssueStatus.TODO,
        2L,
        1L,
        null,
        sprintId,
        1000.0,
        null);

    MoveSprintIssue moveSprintIssue =
        new MoveSprintIssue(1L, 2L, IssueStatus.IN_PROGRESS, 1000.0, 2000.0);

    Sprint sprint = new Sprint(sprintId, "스프린트", SprintStatus.READY, null, null, null, 1L);

    when(issueReader.readIssue(user, 1L)).thenReturn(issue);
    when(sprintReader.findSprint(sprintId)).thenReturn(sprint);

    sprintIssueMover.moveSprintIssue(user, sprintId, moveSprintIssue);

    verify(issueModifier)
        .modifyIssueStatus(user, 1L, new ModifyIssueStatus(IssueStatus.IN_PROGRESS));
    verify(issueModifier).modifyIssuePosition(1L, 1500.0);
  }

  @Test
  void moveSprintIssue_componentOnlyChanged_doesNotThrow() {

    User user = new User(1L);
    Long sprintId = 1L;

    Issue issue = new Issue(
        1L,
        "이슈",
        "내용",
        "KEY",
        1L,
        Importance.HIGH,
        IssueStatus.TODO,
        2L,
        1L,
        null,
        sprintId,
        1000.0,
        null);

    MoveSprintIssue moveSprintIssue = new MoveSprintIssue(1L, 3L, IssueStatus.TODO, 1000.0, 2000.0);

    Sprint sprint = new Sprint(sprintId, "스프린트", SprintStatus.READY, null, null, null, 1L);

    when(issueReader.readIssue(user, 1L)).thenReturn(issue);
    when(sprintReader.findSprint(sprintId)).thenReturn(sprint);

    sprintIssueMover.moveSprintIssue(user, sprintId, moveSprintIssue);

    verify(issueModifier).modifyIssueComponent(user, 1L, new ModifyIssueComponent(3L));
    verify(issueModifier).modifyIssuePosition(1L, 1500.0);
  }

  @Test
  void moveSprintIssue_bothChanged_doesNotThrow() {

    User user = new User(1L);
    Long sprintId = 1L;

    Issue issue = new Issue(
        1L,
        "이슈",
        "내용",
        "KEY",
        1L,
        Importance.HIGH,
        IssueStatus.TODO,
        2L,
        1L,
        null,
        sprintId,
        1000.0,
        null);

    MoveSprintIssue moveSprintIssue =
        new MoveSprintIssue(1L, 3L, IssueStatus.IN_PROGRESS, 1000.0, 2000.0);

    Sprint sprint = new Sprint(sprintId, "스프린트", SprintStatus.READY, null, null, null, 1L);

    when(issueReader.readIssue(user, 1L)).thenReturn(issue);
    when(sprintReader.findSprint(sprintId)).thenReturn(sprint);

    sprintIssueMover.moveSprintIssue(user, sprintId, moveSprintIssue);

    verify(issueModifier)
        .modifyIssueStatus(user, 1L, new ModifyIssueStatus(IssueStatus.IN_PROGRESS));
    verify(issueModifier).modifyIssueComponent(user, 1L, new ModifyIssueComponent(3L));
    verify(issueModifier).modifyIssuePosition(1L, 1500.0);
  }

  @Test
  void moveSprintIssue_noChange_positionChanged_doesNotThrow() {
    User user = new User(1L);
    Long sprintId = 1L;

    Issue issue = new Issue(
        1L,
        "이슈",
        "내용",
        "KEY",
        1L,
        Importance.HIGH,
        IssueStatus.TODO,
        2L,
        1L,
        null,
        sprintId,
        1000.0,
        null);

    MoveSprintIssue moveSprintIssue = new MoveSprintIssue(1L, 2L, IssueStatus.TODO, 1000.0, 1500.0);

    Sprint sprint = new Sprint(sprintId, "스프린트", SprintStatus.READY, null, null, null, 1L);

    when(issueReader.readIssue(user, 1L)).thenReturn(issue);
    when(sprintReader.findSprint(sprintId)).thenReturn(sprint);

    sprintIssueMover.moveSprintIssue(user, sprintId, moveSprintIssue);

    verify(issueModifier).modifyIssuePosition(1L, 1250.0);
  }

  @Test
  void moveSprintIssue_noChange_positionNotChanged_doesNotThrow() {
    User user = new User(1L);
    Long sprintId = 1L;

    Issue issue = new Issue(
        1L,
        "이슈",
        "내용",
        "KEY",
        1L,
        Importance.HIGH,
        IssueStatus.TODO,
        2L,
        1L,
        null,
        sprintId,
        1000.0,
        null);

    MoveSprintIssue moveSprintIssue = new MoveSprintIssue(1L, 2L, IssueStatus.TODO, 1000.0, 1000.0);

    Sprint sprint = new Sprint(sprintId, "스프린트", SprintStatus.READY, null, null, null, 1L);

    when(issueReader.readIssue(user, 1L)).thenReturn(issue);
    when(sprintReader.findSprint(sprintId)).thenReturn(sprint);

    sprintIssueMover.moveSprintIssue(user, sprintId, moveSprintIssue);

    verify(issueModifier, never()).modifyIssuePosition(1L, 1000.0);
  }
}

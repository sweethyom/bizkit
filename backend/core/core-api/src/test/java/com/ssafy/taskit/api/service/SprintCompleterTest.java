package com.ssafy.taskit.api.service;

import static org.mockito.Mockito.*;

import com.ssafy.taskit.domain.CompleteSprint;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueModifier;
import com.ssafy.taskit.domain.IssueReader;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.MemberValidator;
import com.ssafy.taskit.domain.ModifyIssueSprint;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintCompleter;
import com.ssafy.taskit.domain.SprintReader;
import com.ssafy.taskit.domain.SprintRepository;
import com.ssafy.taskit.domain.SprintValidator;
import com.ssafy.taskit.domain.User;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SprintCompleterTest {

  private SprintRepository sprintRepository;
  private SprintValidator sprintValidator;
  private MemberValidator memberValidator;
  private SprintCompleter sprintCompleter;
  private SprintReader sprintReader;

  private IssueReader issueReader;

  private IssueModifier issueModifier;

  @BeforeEach
  void setUp() {
    sprintRepository = mock(SprintRepository.class);
    sprintValidator = mock(SprintValidator.class);
    memberValidator = mock(MemberValidator.class);
    sprintReader = mock(SprintReader.class);
    issueReader = mock(IssueReader.class);
    issueModifier = mock(IssueModifier.class);
    sprintCompleter = new SprintCompleter(
        sprintReader,
        sprintRepository,
        sprintValidator,
        memberValidator,
        issueReader,
        issueModifier);
  }

  @Test
  void completeSprint_movesOnlyNotDoneIssues() {

    Long sprintId = 1L;
    Long toSprintId = 2L;
    User user = mock(User.class);
    when(user.id()).thenReturn(10L);

    Sprint sprint = mock(Sprint.class);
    when(sprint.projectId()).thenReturn(99L);
    when(sprintReader.findSprint(sprintId)).thenReturn(sprint);

    Issue todoIssue = mock(Issue.class);
    when(todoIssue.issueStatus()).thenReturn(IssueStatus.TODO);
    //    when(todoIssue.issueStatus()).thenReturn(IssueStatus.DONE);
    when(todoIssue.id()).thenReturn(101L);

    Issue inProgressIssue = mock(Issue.class);
    when(inProgressIssue.issueStatus()).thenReturn(IssueStatus.IN_PROGRESS);
    //    when(inProgressIssue.issueStatus()).thenReturn(IssueStatus.DONE);
    when(inProgressIssue.id()).thenReturn(102L);

    Issue doneIssue = mock(Issue.class);
    //    when(doneIssue.issueStatus()).thenReturn(IssueStatus.IN_PROGRESS);
    when(doneIssue.issueStatus()).thenReturn(IssueStatus.DONE);
    when(doneIssue.id()).thenReturn(103L);

    when(issueReader.readSprintIssues(user, sprintId))
        .thenReturn(List.of(todoIssue, inProgressIssue, doneIssue));

    CompleteSprint completeSprint = new CompleteSprint(toSprintId);

    sprintCompleter.completeSprint(user, sprintId, completeSprint);

    verify(issueModifier).modifyIssueSprint(eq(user), eq(101L), any(ModifyIssueSprint.class));
    //    verify(issueModifier, never()).modifyIssueSprint(eq(user), eq(101L),
    // any(ModifyIssueSprint.class));
    verify(issueModifier).modifyIssueSprint(eq(user), eq(102L), any(ModifyIssueSprint.class));
    //    verify(issueModifier, never()).modifyIssueSprint(eq(user), eq(102L),
    // any(ModifyIssueSprint.class));
    verify(issueModifier, never()).modifyIssueSprint(eq(user), eq(103L), any());
    //    verify(issueModifier).modifyIssueSprint(eq(user), eq(103L), any(ModifyIssueSprint.class));
  }

  @Test
  void completeSprint_TargetIdIsNull_movesIssuesToBacklog() {
    Long sprintId = 1L;
    User user = mock(User.class);
    when(user.id()).thenReturn(10L);

    Sprint sprint = mock(Sprint.class);
    when(sprint.projectId()).thenReturn(99L);
    when(sprintReader.findSprint(sprintId)).thenReturn(sprint);

    Issue todoIssue = mock(Issue.class);
    when(todoIssue.issueStatus()).thenReturn(IssueStatus.TODO);
    //    when(todoIssue.issueStatus()).thenReturn(IssueStatus.DONE);
    when(todoIssue.id()).thenReturn(101L);

    Issue inProgressIssue = mock(Issue.class);
    when(inProgressIssue.issueStatus()).thenReturn(IssueStatus.IN_PROGRESS);
    //    when(inProgressIssue.issueStatus()).thenReturn(IssueStatus.DONE);
    when(inProgressIssue.id()).thenReturn(102L);

    Issue doneIssue = mock(Issue.class);
    //    when(doneIssue.issueStatus()).thenReturn(IssueStatus.IN_PROGRESS);
    when(doneIssue.issueStatus()).thenReturn(IssueStatus.DONE);
    when(doneIssue.id()).thenReturn(103L);

    when(issueReader.readSprintIssues(user, sprintId))
        .thenReturn(List.of(todoIssue, inProgressIssue, doneIssue));

    CompleteSprint completeSprint = new CompleteSprint(null);
    //    CompleteSprint completeSprint = new CompleteSprint(1L);

    sprintCompleter.completeSprint(user, sprintId, completeSprint);

    verify(issueModifier)
        .modifyIssueSprint(eq(user), eq(101L), argThat(arg -> arg.targetId().equals(0L)));
    verify(issueModifier)
        .modifyIssueSprint(eq(user), eq(102L), argThat(arg -> arg.targetId().equals(0L)));
    verify(issueModifier, never()).modifyIssueSprint(eq(user), eq(103L), any());
  }
}

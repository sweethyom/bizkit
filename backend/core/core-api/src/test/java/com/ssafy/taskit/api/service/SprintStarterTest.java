package com.ssafy.taskit.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueRepository;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.MemberValidator;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintRepository;
import com.ssafy.taskit.domain.SprintStarter;
import com.ssafy.taskit.domain.SprintValidator;
import com.ssafy.taskit.domain.StartSprint;
import com.ssafy.taskit.domain.User;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SprintStarterTest {

  private SprintRepository sprintRepository;
  private SprintValidator sprintValidator;
  private MemberValidator memberValidator;
  private IssueRepository issueRepository;
  private SprintStarter sprintStarter;

  @BeforeEach
  void setUp() {
    sprintRepository = mock(SprintRepository.class);
    sprintValidator = mock(SprintValidator.class);
    memberValidator = mock(MemberValidator.class);
    issueRepository = mock(IssueRepository.class);
    sprintStarter =
        new SprintStarter(sprintRepository, sprintValidator, memberValidator, issueRepository);
  }

  @Test
  void startSprint_success() {
    // Given
    Long sprintId = 1L;
    User user = mock(User.class);
    StartSprint startSprint = new StartSprint(LocalDate.now().plusDays(5));

    Sprint sprint = mock(Sprint.class);
    when(sprint.projectId()).thenReturn(100L);

    // spy()로 Issue 객체 생성 (mock() 대신 spy() 사용)
    Issue issue = mockIssue(true); // isReadyToStart()가 true인 이슈
    when(sprintRepository.findSprint(sprintId)).thenReturn(Optional.of(sprint));
    when(issueRepository.findSprintIssues(sprintId)).thenReturn(List.of(issue));

    // When
    sprintStarter.startSprint(user, sprintId, startSprint);

    // Then
    // isReadyToStart()가 실제로 호출되었는지 확인
    verify(issue, times(1)).isReadyToStart(); // isReadyToStart가 호출됐는지 확인
    verify(sprintRepository).startSprint(sprintId, startSprint);
  }

  @Test
  void startSprint_sprintNotFound_throwsException() {
    //
    //    Sprint sprint = mock(Sprint.class);
    //
    //    when(sprintRepository.findSprint(1L)).thenReturn(Optional.of(sprint));

    when(sprintRepository.findSprint(1L)).thenReturn(Optional.empty());

    CoreException exception = assertThrows(
        CoreException.class,
        () -> sprintStarter.startSprint(
            mock(User.class), 1L, new StartSprint(LocalDate.now().plusDays(1))));

    assertEquals(CoreErrorType.SPRINT_NOT_FOUND, exception.getErrorType());
  }

  @Test
  void startSprint_dueDateBeforeToday_throwsException() {
    Sprint sprint = mock(Sprint.class);
    when(sprint.projectId()).thenReturn(100L);
    when(sprintRepository.findSprint(1L)).thenReturn(Optional.of(sprint));
    when(issueRepository.findSprintIssues(1L)).thenReturn(List.of());

    LocalDate pastDate = LocalDate.now().minusDays(1);

    assertThrows(
        CoreException.class,
        () -> sprintStarter.startSprint(mock(User.class), 1L, new StartSprint(pastDate)));
  }

  @Test
  void check_withInvalidIssues_throwsException() {
    // Given
    Issue notReadyIssue = mockIssue(false); // 준비되지 않은 이슈 생성

    // When
    CoreException exception = assertThrows(
        CoreException.class, () -> sprintStarter.check(List.of(notReadyIssue))); // check 메서드 호출

    // Then
    assertEquals(CoreErrorType.SPRINT_HAS_NOT_VALID_ISSUES, exception.getErrorType()); // 오류 타입 확인

    // 예외 메시지에서 'args'를 확인하여 InvalidIssue 데이터가 포함되어 있는지 검증
    String message = exception.getMessage();
    assertTrue(message.contains("KEY-123")); // 이슈의 키를 포함하고 있는지 확인
    assertTrue(message.contains("Issue Name")); // 이슈의 이름을 포함하고 있는지 확인
  }

  @Test
  void check_allValidIssues_doesNotThrow() {
    List<Issue> issues = List.of(mockIssue(true), mockIssue(true)); // 모두 준비된 이슈

    assertDoesNotThrow(() -> sprintStarter.check(issues));
  }

  // spy() 방식으로 Issue 객체 생성
  private Issue mockIssue(boolean readyToStart) {
    // 실제 Issue 객체를 생성하고 spy로 감싸서 모킹 처리
    Issue issue = new Issue(
        1L,
        "Issue Name",
        "Issue Content",
        "KEY-123",
        5L,
        Importance.HIGH,
        IssueStatus.TODO,
        10L,
        20L,
        30L,
        40L,
        new DefaultDateTime(null, null));

    Issue spyIssue = spy(issue); // spy()로 감싸기
    when(spyIssue.isReadyToStart()).thenReturn(readyToStart); // isReadyToStart() 값 설정

    return spyIssue;
  }
}

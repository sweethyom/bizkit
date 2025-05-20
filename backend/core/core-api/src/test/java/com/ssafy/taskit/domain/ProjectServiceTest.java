package com.ssafy.taskit.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

  @Mock
  private ProjectAppender projectAppender;

  @Mock
  private ProjectReader projectReader;

  @Mock
  private MemberAppender memberAppender;

  @Mock
  private MemberValidator memberValidator;

  @Mock
  private InvitationValidator invitationValidator;

  @Mock
  private ProjectValidator projectValidator;

  @InjectMocks
  private ProjectService projectService;

  private User testUser;
  private NewProject validProject;
  private Project savedProject;

  private List<Project> testProjects;

  private ProjectSort sortType;

  @BeforeEach
  void setUp() {
    DefaultDateTime now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());
    testUser = new User(1L);
    validProject = new NewProject("TEST-KEY", "Test Project");
    savedProject = new Project(1L, 1L, "Test Project", "TEST-KEY", 0, null, now);
    testProjects = new ArrayList<>();

    now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());

    sortType = ProjectSort.RECENT_VIEW;

    testProjects.add(new Project(1L, 1L, "Test Project", "TEST-KEY1", 0, null, now));
    testProjects.add(new Project(2L, 2L, "Test Project", "TEST-KEY2", 0, null, now));
    testProjects.add(new Project(3L, 3L, "Test Project", "TEST-KEY3", 0, null, now));
    testProjects.add(new Project(4L, 4L, "Test Project", "TEST-KEY4", 0, null, now));
  }

  @Test
  @DisplayName("프로젝트 생성 성공 테스트")
  void shouldCreateProjectSuccessfully() {
    // Given
    when(projectAppender.append(any(User.class), any(NewProject.class))).thenReturn(savedProject);
    doNothing().when(memberAppender).appendLeader(any(User.class), any(Project.class));

    // When
    Long projectId = projectService.append(testUser, validProject);

    // Then
    assertThat(projectId).isEqualTo(1L);
    verify(projectAppender, times(1)).append(testUser, validProject);
    verify(memberAppender, times(1)).appendLeader(testUser, savedProject);
  }

  @Test
  @DisplayName("중복 프로젝트 키 예외 테스트")
  void shouldThrowExceptionWhenProjectKeyDuplicated() {
    // Given
    when(projectAppender.append(any(User.class), any(NewProject.class)))
        .thenThrow(new CoreException(CoreErrorType.DUPLICATED_PROJECT_KEY));

    // When & Then
    CoreException exception =
        assertThrows(CoreException.class, () -> projectService.append(testUser, validProject));

    assertThat(exception.getErrorType()).isEqualTo(CoreErrorType.DUPLICATED_PROJECT_KEY);
    verify(memberAppender, never()).appendLeader(any(), any());
  }

  @Test
  @DisplayName("트랜잭션 롤백 테스트 - 멤버 추가 실패 시")
  void shouldRollbackWhenMemberAppendFails() {
    // Given
    when(projectAppender.append(any(User.class), any(NewProject.class))).thenReturn(savedProject);
    doThrow(new RuntimeException("Member append failed"))
        .when(memberAppender)
        .appendLeader(any(User.class), any(Project.class));

    // When & Then
    assertThrows(RuntimeException.class, () -> projectService.append(testUser, validProject));
  }

  @Test
  @DisplayName("cursorId가 null일 때 첫 페이지 조회")
  void shouldReadMyProjectsFirstPage() {
    // Given
    Long cursorId = null;
    int pageSize = 10;
    when(projectReader.readProjectsFirstPageByRecentView(eq(testUser), eq(sortType), eq(pageSize)))
        .thenReturn(testProjects.subList(0, 2));
    // When
    List<Project> result = projectService.findProjects(testUser, sortType, cursorId, pageSize);
    // Then
    assertThat(result).hasSize(2);
    assertThat(result.get(0).id()).isEqualTo(testProjects.get(0).id());
    assertThat(result.get(1).id()).isEqualTo(testProjects.get(1).id());

    verify(projectReader).readProjectsFirstPageByRecentView(testUser, sortType, pageSize);
    verify(projectReader, never()).readProjectsByRecentView(any(), any(), any(), any());
  }

  @Test
  @DisplayName("커서 기반 프로젝트 목록 조회")
  void shouldReadMyProjects() {
    // Given
    Long cursorId = 1L;
    int pageSize = 10;
    when(projectReader.readProjectsByRecentView(
            eq(testUser), eq(sortType), eq(cursorId), eq(pageSize)))
        .thenReturn(testProjects.subList(2, 4));
    // When
    List<Project> result = projectService.findProjects(testUser, sortType, cursorId, pageSize);
    // Then
    assertThat(result).hasSize(2);
    assertThat(result.get(0).id()).isEqualTo(testProjects.get(2).id());
    assertThat(result.get(1).id()).isEqualTo(testProjects.get(3).id());

    verify(projectReader).readProjectsByRecentView(testUser, sortType, cursorId, pageSize);
    verify(projectReader, never()).readProjectsFirstPageByRecentView(any(), any(), any());
  }

  @Test
  @DisplayName("프로젝트 상세 조회")
  void shouldReadProjectDetail() {
    // Given
    Long projectId = testProjects.get(0).id();

    doNothing().when(memberValidator).validateMember(testUser.id(), projectId);
    when(memberValidator.checkProjectLeader(testUser, projectId)).thenReturn(true);

    when(projectReader.readProject(testUser, projectId, true))
        .thenReturn(new ProjectDetail(testProjects.get(0), true));
    // When
    ProjectDetail result = projectService.findProject(testUser, projectId);
    // Then
    assertThat(result).isNotNull();
    assertThat(result.project().id()).isEqualTo(projectId);

    verify(projectReader).readProject(testUser, projectId, true);
  }

  @Test
  @DisplayName("초대코드로 프로젝트 정보 조회")
  void shouldReadInvitedProjectDetail() {
    // Given
    String invitationCode = "invitationCode";
    Long projectId = testProjects.get(0).id();

    doNothing().when(invitationValidator).isInvitedMember(testUser, invitationCode);
    when(projectReader.findInvitationProject(testUser, invitationCode))
        .thenReturn(testProjects.get(0));
    // When
    Project result = projectService.findInvitationProject(testUser, invitationCode);
    // Then
    assertThat(result).isNotNull();
    assertThat(result.id()).isEqualTo(projectId);

    verify(invitationValidator).isInvitedMember(testUser, invitationCode);
  }

  @Test
  @DisplayName("사용자의 프로젝트가 없을 때 빈 목록 반환")
  void shouldReturnEmptyListWhenUserHasNoProjects() {
    // Given
    int pageSize = 10;
    Long cursorId = null;
    when(projectReader.readProjectsFirstPageByRecentView(eq(testUser), eq(sortType), eq(pageSize)))
        .thenReturn(Collections.emptyList());
    // When
    List<Project> result = projectService.findProjects(testUser, sortType, cursorId, pageSize);
    // Then
    assertThat(result).isEmpty();
    verify(projectReader).readProjectsFirstPageByRecentView(testUser, sortType, pageSize);
    verify(projectReader, never()).readProjectsByRecentView(any(), any(), anyLong(), anyInt());
  }

  @Test
  @DisplayName("페이지 크기가 음수일 때 예외 발생")
  void shouldThrowExceptionWhenPageSizeIsNegative() {
    // Given
    Long cursorId = null;
    int pageSize = -1;
    // When&Then
    assertThatThrownBy(() -> projectService.findProjects(testUser, sortType, cursorId, pageSize))
        .isInstanceOf(CoreException.class)
        .extracting("errorType")
        .isEqualTo(CoreErrorType.PAGE_SIZE_NOT_VALID);
  }

  @Test
  @DisplayName("유효하지 않은 프로젝트를 조회할 때 예외 발생")
  void shouldThrowExceptionWhenProjectIsNotExisted() {
    // Given
    Long projectId = 5L;
    when(projectValidator.isProjectExists(projectId))
        .thenThrow(new CoreException(CoreErrorType.PROJECT_NOT_FOUND));
    // When&Then
    assertThatThrownBy(() -> projectService.findProject(testUser, projectId))
        .isInstanceOf(CoreException.class)
        .extracting("errorType")
        .isEqualTo(CoreErrorType.PROJECT_NOT_FOUND);
  }
}

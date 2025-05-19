package com.ssafy.taskit.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;
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
  private MemberAppender memberAppender;

  @InjectMocks
  private ProjectService projectService;

  private User testUser;
  private NewProject validProject;
  private Project savedProject;

  @BeforeEach
  void setUp() {
    DefaultDateTime now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());
    testUser = new User(1L);
    validProject = new NewProject("TEST-KEY", "Test Project");
    savedProject = new Project(1L, 1L, "Test Project", "TEST-KEY", 0, null, now);
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

    // 트랜잭션이 롤백되었는지는 통합 테스트에서 확인하는 것이 좋습니다
  }
}

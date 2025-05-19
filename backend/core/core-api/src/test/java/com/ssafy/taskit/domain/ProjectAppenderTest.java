package com.ssafy.taskit.domain;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ProjectAppenderTest {

  @Mock
  private ProjectRepository projectRepository;

  @Mock
  private ProjectValidator projectValidator;

  @InjectMocks
  private ProjectAppender projectAppender;

  private User testUser;
  private NewProject validProject;

  @BeforeEach
  void setUp() {
    testUser = new User(1L);
    validProject = new NewProject("Test Project", "TEST-KEY");
  }

  @Test
  @DisplayName("새 프로젝트 추가 성공 테스트")
  void shouldAppendNewProject() {
    // Given
    DefaultDateTime now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());
    when(projectRepository.findByKey(anyString())).thenReturn(Optional.empty());
    when(projectRepository.save(any(), any(), any(), anyInt()))
        .thenReturn(new Project(1L, 1L, "Test Project", "TEST-KEY", 0, null, now));

    // When
    Project result = projectAppender.append(testUser, validProject);

    // Then
    Assertions.assertThat(result).isNotNull();
    Assertions.assertThat(result.id()).isEqualTo(1L);
    verify(projectRepository).findByKey("TEST-KEY");
    verify(projectRepository).save(testUser, validProject, null, 0);
  }

  @Test
  @DisplayName("중복 키 예외 테스트")
  void shouldThrowExceptionWhenKeyDuplicated() {
    // Given
    DefaultDateTime now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());
    when(projectRepository.findByKey(anyString()))
        .thenReturn(Optional.of(new Project(1L, 1L, "Test Project", "TEST-KEY", 0, null, now)));

    // When & Then
    CoreException exception =
        assertThrows(CoreException.class, () -> projectAppender.append(testUser, validProject));

    Assertions.assertThat(exception.getErrorType()).isEqualTo(CoreErrorType.DUPLICATED_PROJECT_KEY);
    verify(projectRepository, never()).save(any(), any(), any(), anyInt());
  }
}

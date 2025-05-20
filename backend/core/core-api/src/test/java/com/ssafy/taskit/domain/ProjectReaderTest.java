package com.ssafy.taskit.domain;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.ssafy.taskit.domain.support.DefaultDateTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProjectReaderTest {

  @Mock
  private ProjectRepository projectRepository;

  @Mock
  private MemberRepository memberRepository;

  @Mock
  private ProjectValidator projectValidator;

  @Mock
  private InvitationRepository invitationRepository;

  @InjectMocks
  private ProjectReader projectReader;

  private User testUser;
  private List<Project> testProjects;

  private List<Long> accessibleProjectIds;

  private DefaultDateTime now;

  @BeforeEach
  void setUp() {
    testUser = new User(1L);
    testProjects = new ArrayList<>();
    accessibleProjectIds = Arrays.asList(1L, 2L, 3L);
    now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());

    testProjects.add(new Project(1L, 1L, "Test Project", "TEST-KEY1", 0, null, now));
    testProjects.add(new Project(2L, 2L, "Test Project", "TEST-KEY2", 0, null, now));
    testProjects.add(new Project(3L, 3L, "Test Project", "TEST-KEY3", 0, null, now));
  }

  @Test
  @DisplayName("첫 페이지 프로젝트 목록 조회 테스트")
  void shouldReadFirstPageProjects() {
    // Given
    ProjectSort sortType = ProjectSort.RECENT_VIEW;
    int pageSize = 2;

    when(projectRepository.findUserProjectIds(eq(testUser), eq(sortType)))
        .thenReturn(accessibleProjectIds);

    when(projectRepository.findProjectsFirstPage(eq(accessibleProjectIds), eq(pageSize)))
        .thenReturn(testProjects.subList(0, 2));
    // When
    List<Project> result =
        projectReader.readProjectsFirstPageByRecentView(testUser, sortType, pageSize);
    // Then
    assertThat(result).hasSize(2);
    assertThat(result.get(0).id()).isEqualTo(1L);
    assertThat(result.get(1).id()).isEqualTo(2L);

    verify(projectRepository).findUserProjectIds(testUser, sortType);
    verify(projectRepository).findProjectsFirstPage(accessibleProjectIds, pageSize);
  }

  @Test
  @DisplayName("커서 기반 프로젝트 목록 조회 테스트")
  void shouldReadProjectsWithCursor() {
    // Given
    ProjectSort sortType = ProjectSort.RECENT_VIEW;
    Long cursorId = 1L;
    int pageSize = 2;

    when(projectRepository.findUserProjectIds(eq(testUser), eq(sortType)))
        .thenReturn(accessibleProjectIds);

    when(projectRepository.findProjectsNextPage(
            eq(accessibleProjectIds), eq(cursorId), eq(pageSize)))
        .thenReturn(testProjects.subList(1, 3));

    // When
    List<Project> result =
        projectReader.readProjectsByRecentView(testUser, sortType, cursorId, pageSize);

    // Then
    assertThat(result).hasSize(2);
    assertThat(result.get(0).id()).isEqualTo(2L);
    assertThat(result.get(1).id()).isEqualTo(3L);

    verify(projectRepository).findProjectsNextPage(accessibleProjectIds, cursorId, pageSize);
  }

  @Test
  @DisplayName("프로젝트 상세조회 테스트")
  void shouldReadProject() {
    // Given
    Long projectId = 1L;
    boolean isLeader = true;
    Project project = testProjects.get(0);
    ProjectDetail expectedDetail = new ProjectDetail(project, isLeader);

    doNothing()
        .when(memberRepository)
        .updateLastAccessedAt(eq(testUser.id()), eq(projectId), any(LocalDateTime.class));
    when(projectRepository.findProject(eq(testUser), eq(projectId), eq(isLeader)))
        .thenReturn(expectedDetail);

    // When
    ProjectDetail result = projectReader.readProject(testUser, projectId, isLeader);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.project().id()).isEqualTo(projectId);

    verify(projectRepository).findProject(testUser, projectId, isLeader);
  }

  @Test
  @DisplayName("초대 코드로 프로젝트 정보 조회")
  void shouldReadInvitedProjectDetail() {
    // Given
    String invitationCode = "invitationCode";
    Project project = testProjects.get(0);

    when(invitationRepository.findByInvitationCode(invitationCode))
        .thenReturn(new Invitation(
            1L,
            testUser.id(),
            "user1@test.com",
            1L,
            invitationCode,
            InvitationStatus.PENDING,
            now));
    when(projectRepository.findById(project.id()))
        .thenReturn(new Project(1L, 1L, "Test Project", "TEST-KEY1", 0, null, now));
    // When
    Project result = projectReader.findInvitationProject(testUser, invitationCode);
    // Then
    assertThat(result).isNotNull();
    assertThat(result.id()).isEqualTo(project.id());

    verify(invitationRepository).findByInvitationCode(invitationCode);
  }
}

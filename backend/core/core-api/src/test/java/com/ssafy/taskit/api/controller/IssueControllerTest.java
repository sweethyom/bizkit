package com.ssafy.taskit.api.controller;

import static com.ssafy.s12p21d206.achu.test.api.RestDocsUtils.constraints;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.ComponentService;
import com.ssafy.taskit.domain.Epic;
import com.ssafy.taskit.domain.EpicService;
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueService;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.NewIssue;
import com.ssafy.taskit.domain.Project;
import com.ssafy.taskit.domain.ProjectService;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintService;
import com.ssafy.taskit.domain.SprintStatus;
import com.ssafy.taskit.domain.User;
import com.ssafy.taskit.domain.UserDetail;
import com.ssafy.taskit.domain.UserService;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import io.restassured.http.ContentType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class IssueControllerTest extends RestDocsTest {

  private IssueController controller;
  private IssueService issueService;
  private UserService userService;
  private EpicService epicService;
  private ComponentService componentService;
  private SprintService sprintService;
  private ProjectService projectService;

  @BeforeEach
  public void setUp() {
    issueService = mock(IssueService.class);
    userService = mock(UserService.class);
    epicService = mock(EpicService.class);
    componentService = mock(ComponentService.class);
    sprintService = mock(SprintService.class);
    projectService = mock(ProjectService.class);
    controller = new IssueController(
        issueService, userService, epicService, componentService, sprintService, projectService);
    mockMvc = mockController(controller);
  }

  @Test
  public void appendIssue() {
    when(issueService.append(any(User.class), anyLong(), any(NewIssue.class)))
        .thenReturn(new Issue(
            1L,
            "이슈 1",
            null,
            "PROJECT-2",
            null,
            null,
            null,
            null,
            null,
            1L,
            null,
            200.0,
            new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())));
    given()
        .contentType(ContentType.JSON)
        .body(new AppendIssueRequest("이슈 1"))
        .post("epics/{epicId}/issues", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-issue",
            pathParameters(parameterWithName("epicId").description("이슈를 생성할 에픽 id")),
            requestFields(fieldWithPath("name")
                .type(JsonFieldType.STRING)
                .description("생성할 이슈 이름")
                .attributes(constraints("최대 40byte"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("생성된 이슈 id"))));
  }

  @Test
  public void findIssue() {
    when(issueService.findIssue(any(User.class), anyLong()))
        .thenReturn(new Issue(
            1L,
            "이슈1",
            "내용1",
            "PROJECT-2",
            3L,
            Importance.LOW,
            IssueStatus.UNASSIGNED,
            1L,
            1L,
            1L,
            1L,
            200.0,
            new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())));
    when(userService.findUserDetail(anyLong()))
        .thenReturn(new UserDetail(1L, "채용수", "http://profile1.jpg", "user1@example.com"));
    when(epicService.findEpic(any(User.class), anyLong()))
        .thenReturn(new Epic(
            1L,
            "에픽1",
            "PROJECT-1",
            1L,
            new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())));
    when(componentService.findComponent(anyLong()))
        .thenReturn(new Component(1L, 1L, 1L, "컴포넌트1", "컴포넌트1 내용"));
    when(sprintService.findSprint(anyLong()))
        .thenReturn(new Sprint(
            1L,
            "1주차 스프린트",
            SprintStatus.READY,
            LocalDate.now(),
            LocalDate.now(),
            LocalDate.now(),
            1L));
    given()
        .contentType(ContentType.JSON)
        .get("issues/{issueId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-issue",
            pathParameters(parameterWithName("issueId").description("조회할 이슈 id")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("이슈 id"),
                fieldWithPath("data.name").type(JsonFieldType.STRING).description("이슈 이름"),
                fieldWithPath("data.content").type(JsonFieldType.STRING).description("이슈 내용"),
                fieldWithPath("data.key").type(JsonFieldType.STRING).description("이슈 키"),
                fieldWithPath("data.bizPoint").type(JsonFieldType.NUMBER).description("이슈 비즈포인트"),
                fieldWithPath("data.issueImportance")
                    .type(JsonFieldType.STRING)
                    .description("이슈 중요도"),
                fieldWithPath("data.issueStatus")
                    .type(JsonFieldType.STRING)
                    .description("이슈 진행 상태"),
                fieldWithPath("data.component")
                    .type(JsonFieldType.OBJECT)
                    .description("해당 이슈의 컴포넌트"),
                fieldWithPath("data.component.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 컴포넌트 id"),
                fieldWithPath("data.component.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 컴포넌트 이름"),
                fieldWithPath("data.assignee").type(JsonFieldType.OBJECT).description("해당 이슈의 담당자"),
                fieldWithPath("data.assignee.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 담당자 id"),
                fieldWithPath("data.assignee.nickname")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 이름"),
                fieldWithPath("data.assignee.profileImageUrl")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 프로필 주소"),
                fieldWithPath("data.epic").type(JsonFieldType.OBJECT).description("해당 이슈의 에픽"),
                fieldWithPath("data.epic.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 에픽 id"),
                fieldWithPath("data.epic.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 에픽 이름"),
                fieldWithPath("data.epic.key")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 에픽 키"),
                fieldWithPath("data.sprint").type(JsonFieldType.OBJECT).description("해당 이슈의 스프린트"),
                fieldWithPath("data.sprint.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 스프린트 id"),
                fieldWithPath("data.sprint.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 스프린트 이름"),
                fieldWithPath("data.sprint.sprintStatus")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 스프린트 진행 상태"))));
  }

  @Test
  public void modifyIssueName() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueNameRequest("수정할 이슈명"))
        .patch("issues/{issueId}/name", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-name",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(fieldWithPath("name")
                .type(JsonFieldType.STRING)
                .description("수정할 이슈 이름")
                .attributes(constraints("최대 40byte"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void modifyIssueAssignee() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueAssigneeRequest(2L))
        .patch("issues/{issueId}/assignee", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-assignee",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(
                fieldWithPath("assigneeId").type(JsonFieldType.NUMBER).description("수정할 담당자 id")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void modifyIssueComponent() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueComponentRequest(2L))
        .patch("issues/{issueId}/component", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-component",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(
                fieldWithPath("componentId").type(JsonFieldType.NUMBER).description("수정할 컴포넌트 id")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void modifyIssueBizPoint() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueBizpointRequest(5L))
        .patch("issues/{issueId}/bizPoint", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-bizpoint",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(fieldWithPath("bizPoint")
                .type(JsonFieldType.NUMBER)
                .description("수정할 비즈포인트")
                .attributes(constraints("양수"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void modifyIssueImportance() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueImportanceRequest(Importance.HIGH))
        .patch("issues/{issueId}/importance", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-importance",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(fieldWithPath("issueImportance")
                .type(JsonFieldType.STRING)
                .description("수정할 중요도")
                .attributes(constraints("중요도는 HIGH, LOW 중 하나여야 함"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void modifyIssueContent() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueContentRequest("수정할 이슈 내용"))
        .patch("issues/{issueId}/content", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-content",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(fieldWithPath("content")
                .type(JsonFieldType.STRING)
                .description("수정할 이슈 내용")
                .attributes(constraints("최대 400byte"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void modifyIssueEpic() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueEpicRequest(2L))
        .patch("issues/{issueId}/epic", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-epic",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(
                fieldWithPath("epicId").type(JsonFieldType.NUMBER).description("수정할 에픽 id")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void modifyIssueStatus() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueStatusRequest(IssueStatus.IN_PROGRESS))
        .patch("issues/{issueId}/status", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-status",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(fieldWithPath("issueStatus")
                .type(JsonFieldType.STRING)
                .description("수정할 진행 상태")
                .attributes(constraints("진행 상태는 TODO, IN_PROGRESS, DONE 중 하나여야 함"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void findEpicIssues() {
    when(issueService.findEpicIssues(any(User.class), anyLong()))
        .thenReturn(List.of(
            new Issue(
                1L,
                "이슈1",
                "내용1",
                "PROJECT-1",
                3L,
                Importance.LOW,
                IssueStatus.UNASSIGNED,
                1L,
                1L,
                1L,
                1L,
                200.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                2L,
                "이슈2",
                "내용2",
                "PROJECT-1",
                5L,
                Importance.HIGH,
                IssueStatus.UNASSIGNED,
                2L,
                2L,
                1L,
                1L,
                100.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
    when(componentService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new Component(1L, 1L, 1L, "컴포넌트1", "컴포넌트1 내용"),
            2L,
            new Component(2L, 1L, 2L, "컴포넌트2", "컴포넌트2 내용")));
    when(userService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new UserDetail(1L, "사용자1", "사용자1.jpg", "user1@ssafy.com"),
            2L,
            new UserDetail(2L, "사용자2", "사용자2.jpg", "user2@ssafy.com")));
    given()
        .contentType(ContentType.JSON)
        .get("epics/{epicId}/issues", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-epic-issues",
            pathParameters(parameterWithName("epicId").description("조회할 에픽 id")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("이슈 id"),
                fieldWithPath("data.[].name").type(JsonFieldType.STRING).description("이슈 이름"),
                fieldWithPath("data.[].key").type(JsonFieldType.STRING).description("이슈 키"),
                fieldWithPath("data.[].bizPoint")
                    .type(JsonFieldType.NUMBER)
                    .description("이슈 비즈포인트"),
                fieldWithPath("data.[].issueImportance")
                    .type(JsonFieldType.STRING)
                    .description("이슈 중요도"),
                fieldWithPath("data.[].issueStatus")
                    .type(JsonFieldType.STRING)
                    .description("이슈 진행 상태"),
                fieldWithPath("data.[].component.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 컴포넌트 id"),
                fieldWithPath("data.[].component.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 컴포넌트 이름"),
                fieldWithPath("data.[].user.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 담당자 id"),
                fieldWithPath("data.[].user.nickname")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 이름"),
                fieldWithPath("data.[].user.profileImgUrl")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 프로필 주소"))));
  }

  @Test
  public void findSprintIssues() {
    when(issueService.findSprintIssues(any(User.class), anyLong()))
        .thenReturn(List.of(
            new Issue(
                1L,
                "이슈1",
                "내용1",
                "PROJECT-2",
                3L,
                Importance.LOW,
                IssueStatus.UNASSIGNED,
                1L,
                1L,
                1L,
                1L,
                200.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                2L,
                "이슈2",
                "내용2",
                "PROJECT-4",
                5L,
                Importance.HIGH,
                IssueStatus.UNASSIGNED,
                2L,
                2L,
                2L,
                1L,
                800.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
    when(componentService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new Component(1L, 1L, 1L, "컴포넌트1", "컴포넌트1 내용"),
            2L,
            new Component(2L, 1L, 2L, "컴포넌트2", "컴포넌트2 내용")));
    when(userService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new UserDetail(1L, "사용자1", "사용자1.jpg", "user1@ssafy.com"),
            2L,
            new UserDetail(2L, "사용자2", "사용자2.jpg", "user2@ssafy.com")));
    when(epicService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new Epic(
                1L,
                "에픽1",
                "PROJECT-2",
                1L,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            2L,
            new Epic(
                2L,
                "에픽2",
                "PROJECT-3",
                1L,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
    given()
        .contentType(ContentType.JSON)
        .get("sprints/{sprintId}/issues", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-sprint-issues",
            pathParameters(parameterWithName("sprintId").description("조회할 스프린트 id")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("이슈 id"),
                fieldWithPath("data.[].name").type(JsonFieldType.STRING).description("이슈 이름"),
                fieldWithPath("data.[].key").type(JsonFieldType.STRING).description("이슈 키"),
                fieldWithPath("data.[].bizPoint")
                    .type(JsonFieldType.NUMBER)
                    .description("이슈 비즈포인트"),
                fieldWithPath("data.[].issueImportance")
                    .type(JsonFieldType.STRING)
                    .description("이슈 중요도"),
                fieldWithPath("data.[].issueStatus")
                    .type(JsonFieldType.STRING)
                    .description("이슈 진행 상태"),
                fieldWithPath("data.[].component.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 컴포넌트 id"),
                fieldWithPath("data.[].component.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 컴포넌트 이름"),
                fieldWithPath("data.[].user.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 담당자 id"),
                fieldWithPath("data.[].user.nickname")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 이름"),
                fieldWithPath("data.[].user.profileImgUrl")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 프로필 주소"),
                fieldWithPath("data.[].epic.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 에픽 id"),
                fieldWithPath("data.[].epic.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 에픽 이름"),
                fieldWithPath("data.[].epic.key")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 에픽 키"))));
  }

  @Test
  public void findComponentIssues() {
    when(issueService.findComponentIssues(any(User.class), anyLong(), anyLong()))
        .thenReturn(List.of(
            new Issue(
                1L,
                "이슈1",
                "내용1",
                "PROJECT-2",
                3L,
                Importance.LOW,
                IssueStatus.DONE,
                1L,
                1L,
                1L,
                1L,
                200.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                2L,
                "이슈2",
                "내용2",
                "PROJECT-3",
                5L,
                Importance.HIGH,
                IssueStatus.DONE,
                1L,
                1L,
                1L,
                1L,
                300.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                3L,
                "이슈3",
                "내용3",
                "PROJECT-4",
                5L,
                Importance.HIGH,
                IssueStatus.IN_PROGRESS,
                1L,
                1L,
                1L,
                1L,
                400.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                4L,
                "이슈4",
                "내용4",
                "PROJECT-5",
                3L,
                Importance.LOW,
                IssueStatus.IN_PROGRESS,
                1L,
                1L,
                1L,
                1L,
                500.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                5L,
                "이슈5",
                "내용5",
                "PROJECT-6",
                5L,
                Importance.HIGH,
                IssueStatus.TODO,
                1L,
                1L,
                1L,
                1L,
                600.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                6L,
                "이슈6",
                "내용6",
                "PROJECT-7",
                5L,
                Importance.HIGH,
                IssueStatus.TODO,
                1L,
                1L,
                1L,
                1L,
                700.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
    when(componentService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new Component(1L, 1L, 1L, "컴포넌트1", "컴포넌트1 내용"),
            2L,
            new Component(2L, 1L, 2L, "컴포넌트2", "컴포넌트2 내용")));
    when(userService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new UserDetail(1L, "사용자1", "사용자1.jpg", "user1@ssafy.com"),
            2L,
            new UserDetail(2L, "사용자2", "사용자2.jpg", "user2@ssafy.com")));
    when(epicService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new Epic(
                1L,
                "에픽1",
                "PROJECT-2",
                1L,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            2L,
            new Epic(
                2L,
                "에픽2",
                "PROJECT-3",
                1L,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
    given()
        .contentType(ContentType.JSON)
        .pathParam("projectId", 1L)
        .queryParam("componentId", 1L)
        .get("sprints/ongoing/{projectId}/components/issues", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-component-issues",
            pathParameters(parameterWithName("projectId").description("조회할 프로젝트 id")),
            queryParameters(
                parameterWithName("componentId").description("조회할 컴포넌트 id").optional()),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].issueStatus")
                    .type(JsonFieldType.STRING)
                    .description("이슈 진행 상태"),
                fieldWithPath("data.[].issues.[].id")
                    .type(JsonFieldType.NUMBER)
                    .description("이슈 id"),
                fieldWithPath("data.[].issues.[].name")
                    .type(JsonFieldType.STRING)
                    .description("이슈 이름"),
                fieldWithPath("data.[].issues.[].key")
                    .type(JsonFieldType.STRING)
                    .description("이슈 키"),
                fieldWithPath("data.[].issues.[].bizPoint")
                    .type(JsonFieldType.NUMBER)
                    .description("이슈 비즈포인트"),
                fieldWithPath("data.[].issues.[].issueImportance")
                    .type(JsonFieldType.STRING)
                    .description("이슈 중요도"),
                fieldWithPath("data.[].issues.[].component.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 컴포넌트 id"),
                fieldWithPath("data.[].issues.[].component.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 컴포넌트 이름"),
                fieldWithPath("data.[].issues.[].user.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 담당자 id"),
                fieldWithPath("data.[].issues.[].user.nickname")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 이름"),
                fieldWithPath("data.[].issues.[].user.profileImgUrl")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 프로필 주소"),
                fieldWithPath("data.[].issues.[].epic.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 에픽 id"),
                fieldWithPath("data.[].issues.[].epic.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 에픽 이름"),
                fieldWithPath("data.[].issues.[].epic.key")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 에픽 키"))));
  }

  @Test
  public void modifyIssueSprint() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueSprintRequest(2L))
        .patch("issues/{issueId}/move-sprint", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-issue-sprint",
            pathParameters(parameterWithName("issueId").description("수정할 이슈 id")),
            requestFields(fieldWithPath("targetId")
                .type(JsonFieldType.NUMBER)
                .description("이슈를 이동시킬 스프린트 id")
                .attributes(constraints("백로그인 경우 0"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void findMyIssues() {
    when(issueService.findMyIssues(any(User.class), any(), anyLong(), anyInt()))
        .thenReturn(List.of(
            new Issue(
                4L,
                "이슈4",
                "내용4",
                "PROJECT-5",
                5L,
                Importance.HIGH,
                IssueStatus.TODO,
                1L,
                1L,
                1L,
                1L,
                400.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                1L,
                "이슈1",
                "내용1",
                "PROJECT-2",
                3L,
                Importance.HIGH,
                IssueStatus.TODO,
                1L,
                1L,
                1L,
                1L,
                100.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                2L,
                "이슈2",
                "내용2",
                "PROJECT-3",
                3L,
                Importance.LOW,
                IssueStatus.TODO,
                1L,
                1L,
                1L,
                1L,
                300.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                3L,
                "이슈3",
                "내용3",
                "PROJECT-4",
                3L,
                Importance.LOW,
                IssueStatus.TODO,
                1L,
                1L,
                1L,
                1L,
                700.0,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
    when(epicService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new Epic(
                1L,
                "에픽1",
                "PROJECT-2",
                1L,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            2L,
            new Epic(
                2L,
                "에픽2",
                "PROJECT-3",
                2L,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
    when(projectService.mapByIds(any()))
        .thenReturn(Map.of(
            1L,
            new Project(
                1L,
                1L,
                "프로젝트1",
                "PROJECT1",
                0,
                "project1.jpg",
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            2L,
            new Project(
                2L,
                2L,
                "프로젝트2",
                "PJT2",
                0,
                "project2.jpg",
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
    given()
        .contentType(ContentType.JSON)
        .queryParam("issueStatus", "TODO")
        .queryParam("cursorId", 10L)
        .queryParam("pageSize", 5)
        .get("issues/me")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-my-issues",
            queryParameters(
                parameterWithName("issueStatus")
                    .description("조회 할 이슈들의 진행 상태")
                    .attributes(constraints("TODO, IN_PROGRESS 중 하나")),
                parameterWithName("cursorId")
                    .description("이전 페이지에서 마지막으로 조회된 이슈의 ID. null이면 첫 페이지를 조회"),
                parameterWithName("pageSize")
                    .description("한 페이지에서 조회할 이슈의 갯수")
                    .attributes(constraints("양의 정수"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("이슈 id"),
                fieldWithPath("data.[].name").type(JsonFieldType.STRING).description("이슈 이름"),
                fieldWithPath("data.[].key").type(JsonFieldType.STRING).description("이슈 키"),
                fieldWithPath("data.[].issueImportance")
                    .type(JsonFieldType.STRING)
                    .description("이슈 중요도"),
                fieldWithPath("data.[].epic.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 에픽 id"),
                fieldWithPath("data.[].epic.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 에픽 이름"),
                fieldWithPath("data.[].epic.key")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 에픽 이름"),
                fieldWithPath("data.[].project.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 프로젝트 id"),
                fieldWithPath("data.[].project.name")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 프로젝트 이름"))));
  }

  @Test
  public void deleteIssue() {
    given()
        .contentType(ContentType.JSON)
        .delete("issues/{issueId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "delete-issue",
            pathParameters(parameterWithName("issueId").description("삭제할 이슈 id")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }
}

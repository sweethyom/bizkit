package com.ssafy.taskit.api.controller;

import static com.ssafy.s12p21d206.achu.test.api.RestDocsUtils.constraints;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
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
import com.ssafy.taskit.domain.Importance;
import com.ssafy.taskit.domain.Issue;
import com.ssafy.taskit.domain.IssueService;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.NewIssue;
import com.ssafy.taskit.domain.User;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import io.restassured.http.ContentType;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class IssueControllerTest extends RestDocsTest {

  private IssueController controller;
  private IssueService issueService;

  @BeforeEach
  public void setUp() {
    issueService = mock(IssueService.class);
    controller = new IssueController(issueService);
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
  public void modifyIssueBizpoint() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyIssueBizpointRequest(5L))
        .patch("issues/{issueId}/bizpoint", 1L)
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
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                2L,
                "이슈2",
                "내용2",
                "PROJECT-1",
                5L,
                Importance.HIGH,
                IssueStatus.UNASSIGNED,
                1L,
                1L,
                1L,
                1L,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now()))));
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
                fieldWithPath("data.[].assignee.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 담당자 id"),
                fieldWithPath("data.[].assignee.nickname")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 이름"),
                fieldWithPath("data.[].assignee.profileImageUrl")
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
                "PROJECT-1",
                3L,
                Importance.LOW,
                IssueStatus.UNASSIGNED,
                1L,
                1L,
                1L,
                1L,
                new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())),
            new Issue(
                2L,
                "이슈2",
                "내용2",
                "PROJECT-1",
                5L,
                Importance.HIGH,
                IssueStatus.UNASSIGNED,
                1L,
                1L,
                1L,
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
                fieldWithPath("data.[].assignee.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 담당자 id"),
                fieldWithPath("data.[].assignee.nickname")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 이름"),
                fieldWithPath("data.[].assignee.profileImageUrl")
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
    given()
        .contentType(ContentType.JSON)
        .get("components/{componentId}/issues", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-component-issues",
            pathParameters(parameterWithName("componentId").description("조회할 컴포넌트 id")),
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
                fieldWithPath("data.[].issues.[].assignee.id")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 이슈의 담당자 id"),
                fieldWithPath("data.[].issues.[].assignee.nickname")
                    .type(JsonFieldType.STRING)
                    .description("해당 이슈의 담당자 이름"),
                fieldWithPath("data.[].issues.[].assignee.profileImageUrl")
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
    given()
        .contentType(ContentType.JSON)
        .queryParam("status", "TODO")
        .queryParam("cursor", 10)
        .get("issues/me")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-my-issues",
            queryParameters(
                parameterWithName("status")
                    .description("조회 할 이슈들의 진행 상태")
                    .attributes(constraints("TODO, IN_PROGRESS 중 하나여야 함")),
                parameterWithName("cursor").description("커서값")),
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
}

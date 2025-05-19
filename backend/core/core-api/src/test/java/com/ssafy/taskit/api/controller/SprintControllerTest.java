package com.ssafy.taskit.api.controller;

import static com.ssafy.s12p21d206.achu.test.api.RestDocsUtils.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.restdocs.snippet.Attributes.key;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import com.ssafy.taskit.domain.IssueHandlingOption;
import com.ssafy.taskit.domain.IssueStatus;
import com.ssafy.taskit.domain.NewSprint;
import com.ssafy.taskit.domain.Sprint;
import com.ssafy.taskit.domain.SprintService;
import com.ssafy.taskit.domain.SprintStatus;
import com.ssafy.taskit.domain.User;
import io.restassured.http.ContentType;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class SprintControllerTest extends RestDocsTest {

  private SprintController controller;

  private SprintService sprintService;

  @BeforeEach
  void setup() {
    sprintService = mock(SprintService.class);
    controller = new SprintController(sprintService);
    mockMvc = mockController(controller);
  }

  @Test
  void appendSprint() {
    when(sprintService.append(any(User.class), anyLong(), any(NewSprint.class)))
        .thenReturn(new Sprint(1L, "스프린트 이름", SprintStatus.READY, null, null, null, 1L));
    given()
        .contentType(ContentType.JSON)
        .body(new AppendSprintRequest("생성할 스프린트 제목"))
        .post("/projects/{projectId}/sprints", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-sprint",
            pathParameters(parameterWithName("projectId").description("스프린트를 생성하고 싶은 프로젝트 아이디")),
            requestFields(fieldWithPath("name")
                .type(JsonFieldType.STRING)
                .description("스프린트 아이디")
                .attributes(key("constraints").value("스프린트 이름 : 최대 40byte, notBlank"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("생성된 스프린트 아이디"))));
  }

  @Test
  void findSprints() {
    when(sprintService.findSprints(any(User.class), anyLong()))
        .thenReturn(List.of(
            new Sprint(1L, "대기 중 스프린트", SprintStatus.READY, null, null, null, 1L),
            new Sprint(
                2L,
                "진행 중 스프린트",
                SprintStatus.ONGOING,
                LocalDate.of(2024, 5, 1),
                LocalDate.of(2024, 5, 15),
                null,
                1L),
            new Sprint(
                3L,
                "완료된 스프린트",
                SprintStatus.COMPLETED,
                LocalDate.of(2024, 4, 1),
                LocalDate.of(2024, 4, 15),
                LocalDate.of(2024, 4, 16),
                1L)));

    given()
        .contentType(ContentType.JSON)
        .get("/projects/{projectId}/sprints", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-sprints",
            pathParameters(parameterWithName("projectId").description("스프린트 목록을 조회하고 싶은 프로젝트 아이디")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("스프린트 아이디"),
                fieldWithPath("data.[].name").type(JsonFieldType.STRING).description("스프린트 이름"),
                fieldWithPath("data.[].sprintStatus")
                    .type(JsonFieldType.STRING)
                    .description("스프린트 상태 (READY, ONGOING, COMPLETED)"),
                fieldWithPath("data.[].startDate")
                    .optional()
                    .type(JsonFieldType.STRING)
                    .description("스프린트 시작일 (스프린트 진행 / 종료 상태의 경우 존재)"),
                fieldWithPath("data.[].dueDate")
                    .optional()
                    .type(JsonFieldType.STRING)
                    .description("스프린트 예상 종료일 (스프린트 진행 / 종료 상태의 경우 존재)"),
                fieldWithPath("data.[].completedDate")
                    .optional()
                    .type(JsonFieldType.STRING)
                    .description("스프린트 실제 종료일 (종료 상태일 경우만 존재)"))));
  }

  @Test
  void modifySprintName() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifySprintNameRequest("수정할 스프린트 이름"))
        .patch("/sprints/{sprintId}/name", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-sprint-name",
            pathParameters(parameterWithName("sprintId").description("이름을 수정할 스프린트 id")),
            requestFields(fieldWithPath("name")
                .type(JsonFieldType.STRING)
                .description("수정할 스프린트명")
                .attributes(key("constraints").value("최대 40byte, notBlank"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  void deleteSprint() {
    given()
        .contentType(ContentType.JSON)
        .body(new DeleteSprintRequest(IssueHandlingOption.DELETE))
        .delete("/sprints/{sprintId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "delete-sprint",
            pathParameters(parameterWithName("sprintId").description("삭제하고 싶은 스프린트 아이디")),
            requestFields(fieldWithPath("option")
                .type(JsonFieldType.STRING)
                .description("스프린트 하위 이슈 삭제 / 이동 여부")
                .attributes(
                    constraints("(DELETE: 삭제, MOVE_TO_BACKLOG: 백로그 이동) 무조건 둘 중 하나는 선택해야함"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR"))));
  }

  @Test
  void modifySprintDueDate() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifySprintDueDateRequest(LocalDate.of(2025, 05, 02)))
        .patch("/sprints/{sprintId}/due-date", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-sprint-dueDate",
            pathParameters(parameterWithName("sprintId").description("예상 종료일을 수정하고 싶은 스프린트 아이디")),
            requestFields(fieldWithPath("dueDate")
                .type(JsonFieldType.ARRAY)
                .attributes(constraints("예상 종료일은 시작일 보다 빠를 수 없음"))
                .description("수정할 예상 종료일")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }

  @Test
  void startSprint() {
    given()
        .contentType(ContentType.JSON)
        .body(new StartSprintRequest(LocalDate.of(2025, 5, 2)))
        .patch("/sprints/{sprintId}/start", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "start-sprint",
            pathParameters(parameterWithName("sprintId").description("시작하고 싶은 스프린트의 아이디")),
            requestFields(fieldWithPath("dueDate")
                .type(JsonFieldType.ARRAY)
                .attributes(constraints("예상 종료일은 시작일 보다 빠를 수 없음"))
                .description("시작하고 싶은 스프린트의 예상 종료일")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.[].id")
                    .optional()
                    .type(JsonFieldType.NUMBER)
                    .description("ERROR 발생시 에러의 원인이 존재하는 이슈의 아이디 (null 속성 존재)"),
                fieldWithPath("data.[].name")
                    .optional()
                    .type(JsonFieldType.STRING)
                    .description("ERROR 발생시 에러의 원인이 존재하는 이슈의 제목 (null 속성 존재)"),
                fieldWithPath("data.[].key")
                    .optional()
                    .type(JsonFieldType.STRING)
                    .description("ERROR 발생시 에러의 원인이 존재하는 이슈의 키 (null 속성 존재)"))));
  }

  @Test
  void completeSprint() {
    given()
        .contentType(ContentType.JSON)
        .body(new CompleteSprintRequest(1L))
        .patch("sprints/{sprintId}/complete", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "complete-sprint",
            pathParameters(parameterWithName("sprintId").description("종료하고 싶은 스프린트의 아이디")),
            requestFields(fieldWithPath("id")
                .type(JsonFieldType.NUMBER)
                .optional()
                .attributes(constraints("종료하고 싶은 스프린트의 아이디가 이슈를 옮길 스프린트의 아이디와 같으면 안됨"))
                .description("이슈를 옮길 스프린트의 아이디")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }

  @Test
  void moveSprintIssue() {
    given()
        .contentType(ContentType.JSON)
        .body(new MoveSprintIssueRequest(
            2L, // moveIssuesId
            5L, // componentId
            IssueStatus.IN_PROGRESS, // status
            1000.0, // beforeIssuePosition
            2000.0 // afterIssuePosition
            ))
        .patch("/sprints/{sprintId}/moveIssues", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "move-sprint-issue",
            pathParameters(parameterWithName("sprintId").description("이슈를 이동할 대상 스프린트 ID")),
            requestFields(
                fieldWithPath("moveIssueId").type(JsonFieldType.NUMBER).description("이동할 이슈 ID"),
                fieldWithPath("preIssueId")
                    .type(JsonFieldType.NUMBER)
                    .optional()
                    .description("기준이 되는 이전 이슈 ID (null이면 가장 앞으로 이동)"),
                fieldWithPath("componentId")
                    .type(JsonFieldType.NUMBER)
                    .optional()
                    .description("이동할 컴포넌트 ID"),
                fieldWithPath("status")
                    .type(JsonFieldType.STRING)
                    .optional()
                    .description("이동할 이슈의 상태 (예: TODO, IN_PROGRESS, DONE)")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS or ERROR)"))));
  }
}

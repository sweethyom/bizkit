package com.ssafy.taskit.api.controller;

import static com.ssafy.s12p21d206.achu.test.api.RestDocsUtils.constraints;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class EpicControllerTest extends RestDocsTest {

  private EpicController controller;

  @BeforeEach
  public void setUp() {
    controller = new EpicController();
    mockMvc = mockController(controller);
  }

  @Test
  public void appendEpic() {
    given()
        .contentType(ContentType.JSON)
        .body(new AppendEpicRequest("에픽 이름"))
        .post("projects/{projectId}/epics", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-epic",
            pathParameters(parameterWithName("projectId").description("에픽을 생성할 프로젝트 id")),
            requestFields(fieldWithPath("name")
                .type(JsonFieldType.STRING)
                .description("생성할 에픽 이름")
                .attributes(constraints("최대 40byte"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("생성된 에픽 id"))));
  }

  @Test
  public void findEpics() {
    given()
        .contentType(ContentType.JSON)
        .get("projects/{projectId}/epics", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-epics",
            pathParameters(parameterWithName("projectId").description("에픽 목록을 조회할 프로젝트 id")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("에픽 id"),
                fieldWithPath("data.[].key").type(JsonFieldType.STRING).description("해당 에픽의 키"),
                fieldWithPath("data.[].name").type(JsonFieldType.STRING).description("해당 에픽의 이름"),
                fieldWithPath("data.[].totalIssues")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 에픽의 전체 이슈 갯수"),
                fieldWithPath("data.[].remainIssues")
                    .type(JsonFieldType.NUMBER)
                    .description("해당 에픽의 남은 이슈 갯수"))));
  }

  @Test
  public void modifyEpicName() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyEpicNameRequest("수정할 에픽명"))
        .patch("epics/{epicId}/name", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-epic-name",
            pathParameters(parameterWithName("epicId").description("이름을 수정할 에픽 id")),
            requestFields(fieldWithPath("name")
                .type(JsonFieldType.STRING)
                .description("수정할 에픽명")
                .attributes(constraints("최대 40byte"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void deleteEpic() {
    given()
        .contentType(ContentType.JSON)
        .delete("epics/{epicId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "delete-epic",
            pathParameters(parameterWithName("epicId").description("삭제할 에픽 id")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }
}

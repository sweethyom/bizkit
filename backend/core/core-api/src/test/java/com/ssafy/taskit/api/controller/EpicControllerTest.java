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
}

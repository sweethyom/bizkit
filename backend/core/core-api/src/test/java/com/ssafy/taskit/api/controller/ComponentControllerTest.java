package com.ssafy.taskit.api.controller;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;
import static org.springframework.restdocs.snippet.Attributes.key;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class ComponentControllerTest extends RestDocsTest {

  private ComponentController controller;

  @BeforeEach
  void setup() {
    controller = new ComponentController();
    mockMvc = mockController(controller);
  }

  @Test
  void appendComponent() {
    given()
        .contentType(ContentType.JSON)
        .body(new AppendComponentRequest("컴포넌트 아이디", "컴포넌트 설명"))
        .post("/projects/{projectId}/components", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-component",
            pathParameters(parameterWithName("projectId").description("컴포넌트를 생성하고 싶은 프로젝트 아이디")),
            requestFields(
                fieldWithPath("name")
                    .type(JsonFieldType.STRING)
                    .description("등록할 컴포넌트의 이름")
                    .attributes(key("constraints").value("최대 20bytes (앞, 뒤 공백 불가)")),
                fieldWithPath("description")
                    .optional()
                    .type(JsonFieldType.STRING)
                    .description("등록할 컴포넌트의 설명")
                    .attributes(key("constraints").value("최대 100bytes (앞, 뒤 공백 불가)"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("생성된 컴포넌트 아이디"))));
  }

  @Test
  void findComponents() {
    given()
        .contentType(ContentType.JSON)
        .get("/projects/{projectId}/components", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-components",
            pathParameters(parameterWithName("projectId").description("컴포넌트 목록을 조회하고 싶은 프로젝트 아이디")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("컴포넌트 아이디"),
                fieldWithPath("data.[].title").type(JsonFieldType.STRING).description("컴포넌트 이름"),
                fieldWithPath("data.[].description")
                    .type(JsonFieldType.STRING)
                    .description("컴포넌트 설명"))));
  }
}

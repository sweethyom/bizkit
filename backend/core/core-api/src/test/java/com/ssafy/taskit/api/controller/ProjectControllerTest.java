package com.ssafy.taskit.api.controller;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import com.ssafy.s12p21d206.achu.test.api.RestDocsUtils;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class ProjectControllerTest extends RestDocsTest {
  ProjectController controller;

  @BeforeEach
  public void setup() {
    controller = new ProjectController();
    mockMvc = mockController(controller);
  }

  @Test
  public void appendProject() {
    given()
        .contentType(ContentType.JSON)
        .body(new AppendProjectRequest("프로젝트 이름1"))
        .post("/projects")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-project",
            requestFields(fieldWithPath("name")
                .type(JsonFieldType.STRING)
                .attributes(RestDocsUtils.constraints("최대 40byte (앞뒤 공백 불가)"))
                .description("생성할 프로젝트 이름")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("생성된 프로젝트의 id"))));
  }

  @Test
  public void findProjects() {
    given()
        .contentType(ContentType.JSON)
        .get("/projects")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-projects",
            queryParameters(parameterWithName("cursor")
                .optional()
                .description("이전 페이지의 마지막 프로젝트 ID(커서, 첫 페이지 요청 시 생략)")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("내가 속한 프로젝트 id"),
                fieldWithPath("data.[].name")
                    .type(JsonFieldType.STRING)
                    .description("내가 속한 프로젝트 이름"),
                fieldWithPath("data.[].image")
                    .type(JsonFieldType.STRING)
                    .description("내가 속한 프로젝트 이미지 경로"),
                fieldWithPath("data.[].count")
                    .type(JsonFieldType.NUMBER)
                    .description("프로젝트 내 나의 할 일 개수"))));
  }
}

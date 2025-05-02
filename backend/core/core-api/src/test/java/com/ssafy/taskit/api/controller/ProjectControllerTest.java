package com.ssafy.taskit.api.controller;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;

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
                .description("페이지네이션 커서, 이전 페이지의 마지막 프로젝트 ID를 입력.첫 페이지 요청 시 생략하거나 빈값으로 요청)")),
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

  @Test
  public void findProject() {
    given()
        .contentType(ContentType.JSON)
        .get("/projects/{projectId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-project",
            pathParameters(parameterWithName("projectId").description("조회할 프로젝트 id")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("내가 속한 프로젝트 id"),
                fieldWithPath("data.name").type(JsonFieldType.STRING).description("내가 속한 프로젝트 이름"),
                fieldWithPath("data.image")
                    .type(JsonFieldType.STRING)
                    .description("내가 속한 프로젝트 이미지 경로"),
                fieldWithPath("data.leader")
                    .type(JsonFieldType.BOOLEAN)
                    .description("프로젝트 팀장 여부"))));
  }

  @Test
  public void modifyProjectName() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyProjectNameRequest("프로젝트 제목1"))
        .patch("/projects/{projectId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-project",
            pathParameters(parameterWithName("projectId").description("수정할 프로젝트 id")),
            requestFields(
                fieldWithPath("name").type(JsonFieldType.STRING).description("수정할 프로젝트 이름")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }

  @Test
  public void modifyProjectImage() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyProjectImageRequest("default001.jpg"))
        .patch("projects/{projectId}/image", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-project-image",
            pathParameters(parameterWithName("projectId").description("이미지를 수정할 프로젝트 id")),
            requestFields(
                fieldWithPath("image").type(JsonFieldType.STRING).description("수정할 프로젝트 이미지")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }

  @Test
  public void deleteProject() {
    given()
        .contentType(ContentType.JSON)
        .delete("projects/{projectId}", 2L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "delete-project",
            pathParameters(parameterWithName("projectId").description("삭제할 프로젝트 id")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }

  @Test
  public void findInvitationProject() {
    given()
        .contentType(ContentType.JSON)
        .get("projects/invitation/{invitationId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-invitation-project",
            pathParameters(parameterWithName("invitationId").description("프로젝트 초대 id")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("초대된 프로젝트 id"),
                fieldWithPath("data.name").type(JsonFieldType.STRING).description("초대된 프로젝트 이름"),
                fieldWithPath("data.image").type(JsonFieldType.STRING).description("초대된 프로젝트 이미지"),
                fieldWithPath("data.leader.id")
                    .type(JsonFieldType.NUMBER)
                    .description("초대한 프로젝트 팀장 id"),
                fieldWithPath("data.leader.nickname")
                    .type(JsonFieldType.STRING)
                    .description("초대한 프로젝트 팀장 닉네임"),
                fieldWithPath("data.leader.image")
                    .type(JsonFieldType.STRING)
                    .description("초대한 프로젝트 팀장 이미지"))));
  }
}

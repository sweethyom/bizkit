package com.ssafy.taskit.api.controller;

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
import static org.springframework.restdocs.snippet.Attributes.key;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import com.ssafy.taskit.domain.Component;
import com.ssafy.taskit.domain.ComponentService;
import com.ssafy.taskit.domain.NewComponent;
import com.ssafy.taskit.domain.User;
import io.restassured.http.ContentType;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class ComponentControllerTest extends RestDocsTest {

  private ComponentController controller;

  private ComponentService componentService;

  @BeforeEach
  void setup() {
    componentService = mock(ComponentService.class);
    controller = new ComponentController(componentService);
    mockMvc = mockController(controller);
  }

  @Test
  void appendComponent() {
    when(componentService.append(any(User.class), anyLong(), any(NewComponent.class)))
        .thenReturn(new Component(1L, 1L, 1L, "컴포넌트 이름", "컴포넌트 설명"));

    given()
        .contentType(ContentType.JSON)
        .body(new AppendComponentRequest("컴포넌트", "컴포넌트 설명"))
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
                fieldWithPath("content")
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
    when(componentService.findComponents(any(User.class), anyLong()))
        .thenReturn(List.of(
            new Component(1L, 1L, 1L, "컴포넌트 이름", "컴포넌트 설명"),
            new Component(2L, 1L, 1L, "컴포넌트 이름2", "컴포넌트 설명2"),
            new Component(3L, 1L, 1L, "컴포넌트 이름3", "컴포넌트 설명3")));
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
                fieldWithPath("data.[].name").type(JsonFieldType.STRING).description("컴포넌트 이름"),
                fieldWithPath("data.[].content")
                    .type(JsonFieldType.STRING)
                    .description("컴포넌트 설명"))));
  }

  @Test
  void modifyComponentName() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyComponentNameRequest("컴포넌트"))
        .put("/components/{componentId}/name", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-component-name",
            pathParameters(parameterWithName("componentId").description("이름을 수정하고 싶은 컴포넌트 아이디")),
            requestFields(fieldWithPath("name")
                .type(JsonFieldType.STRING)
                .description("수정할 컴포넌트 이름")
                .attributes(key("constraints").value("최대 20bytes (앞, 뒤 공백 불가)"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("수정된 컴포넌트 아이디"))));
  }

  @Test
  void modifyComponentContent() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyComponentContentRequest("컴포넌트 설명"))
        .put("/components/{componentId}/content", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-component-contents",
            pathParameters(parameterWithName("componentId").description("설명을 수정하고 싶은 컴포넌트 아이디")),
            requestFields(fieldWithPath("content")
                .optional()
                .type(JsonFieldType.STRING)
                .description("수정할 컴포넌트의 설명")
                .attributes(key("constraints").value("최대 100bytes (앞, 뒤 공백 불가)"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("수정된 컴포넌트 설명"))));
  }

  @Test
  void deleteComponent() {
    given()
        .contentType(ContentType.JSON)
        .delete("/components/{componentId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "delete-component",
            pathParameters(parameterWithName("componentId").description("삭제하고 싶은 컴포넌트 아이디")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR"))));
  }
}

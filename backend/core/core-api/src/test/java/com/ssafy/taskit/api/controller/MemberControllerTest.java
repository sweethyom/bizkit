package com.ssafy.taskit.api.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class MemberControllerTest extends RestDocsTest {

  private MemberController controller;

  @BeforeEach
  public void setup() {
    controller = new MemberController();
    mockMvc = mockController(controller);
  }

  @Test
  public void findMembers() {
    given()
        .contentType(ContentType.JSON)
        .get("projects/{projectId}/members", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-members",
            pathParameters(parameterWithName("projectId").description("팀원들이 소속된 프로젝트 id")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("현재 소속된 팀원 id"),
                fieldWithPath("data.[].nickname")
                    .type(JsonFieldType.STRING)
                    .description("현재 소속된 팀원 닉네임"),
                fieldWithPath("data.[].email")
                    .type(JsonFieldType.STRING)
                    .description("현재 소속된 팀원 이메일"),
                fieldWithPath("data.[].profileImage")
                    .type(JsonFieldType.STRING)
                    .description("현재 소속된 팀원 프로필 이미지"),
                fieldWithPath("data.[].leader")
                    .type(JsonFieldType.BOOLEAN)
                    .description("현재 소속된 팀원의 팀장 여부"))));
  }

  @Test
  public void findInvitationMembers() {
    given()
        .contentType(ContentType.JSON)
        .get("projects/{projectId}/members/invitation", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-invitation-members",
            pathParameters(parameterWithName("projectId").description("초대 팀원을 조회할 프로젝트의 id")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].invitationId")
                    .type(JsonFieldType.STRING)
                    .description("초대 id"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("초대한 사용자의 id"),
                fieldWithPath("data.[].nickname")
                    .type(JsonFieldType.STRING)
                    .description("초대한 사용자의 닉네임"),
                fieldWithPath("data.[].email")
                    .type(JsonFieldType.STRING)
                    .description("초대한 사용자의 이메일"),
                fieldWithPath("data.[].profileImage")
                    .type(JsonFieldType.STRING)
                    .description("초대한 사용자의 프로필 이미지"))));
  }

  @Test
  public void appendMember() {
    given()
        .contentType(ContentType.JSON)
        .body(new AppendMemberRequest("초대할 팀원의 이메일"))
        .post("projects/{projectId}/members", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-member",
            pathParameters(parameterWithName("projectId").description("팀원을 초대할 프로젝트")),
            requestFields(
                fieldWithPath("email").type(JsonFieldType.STRING).description("초대할 팀원의 이메일")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.invitationId")
                    .type(JsonFieldType.STRING)
                    .description("팀원을 초대한 초대 id"))));
  }

  @Test
  public void searchUser() {
    given()
        .contentType(ContentType.JSON)
        .body(new SearchUserRequest("검색한 유저의 이메일"))
        .post("projects/{projectId}/members/search", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "search-user",
            pathParameters(parameterWithName("projectId").description("검색한 유저를 초대할 프로젝트 id")),
            requestFields(
                fieldWithPath("email").type(JsonFieldType.STRING).description("검색할 유저의 이메일")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.[].id").type(JsonFieldType.NUMBER).description("검색한 사용자의 id"),
                fieldWithPath("data.[].nickname")
                    .type(JsonFieldType.STRING)
                    .description("검색한 사용자의 닉네임"),
                fieldWithPath("data.[].email")
                    .type(JsonFieldType.STRING)
                    .description("검색한 사용자의 이메일"),
                fieldWithPath("data.[].profileImage")
                    .type(JsonFieldType.STRING)
                    .description("검색한 사용자의 프로필 이미지"))));
  }
}

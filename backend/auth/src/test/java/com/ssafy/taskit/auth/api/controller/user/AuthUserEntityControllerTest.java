package com.ssafy.taskit.auth.api.controller.user;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;

import com.ssafy.taskit.auth.domain.image.AuthImageService;
import com.ssafy.taskit.auth.domain.support.AuthDefaultDateTime;
import com.ssafy.taskit.auth.domain.user.AuthUser;
import com.ssafy.taskit.auth.domain.user.AuthUserImageFacade;
import com.ssafy.taskit.auth.domain.user.AuthUserService;
import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import com.ssafy.s12p21d206.achu.test.api.RestDocsUtils;
import io.restassured.http.ContentType;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;

// sonarqube에서 test에 assertions이 없더라도 code smell로 인식하지 않음
@SuppressWarnings("java:S2699")
class AuthUserEntityControllerTest extends RestDocsTest {

  private AuthUserController controller;
  private AuthUserService authUserService;
  private AuthImageService authImageService;
  private AuthUserImageFacade authUserImageFacade;

  @BeforeEach
  void setup() {
    authUserService = mock(AuthUserService.class);
    authImageService = mock(AuthImageService.class);
    authUserImageFacade = new AuthUserImageFacade(authUserService, authImageService);
    controller = new AuthUserController(authUserService, authUserImageFacade);
    mockMvc = mockController(controller);
  }

  @Test
  void appendUser() {
    when(authUserService.appendAuthUser(any(), any()))
        .thenReturn(new AuthUser(
            1L,
            "test@test.com",
            "password!",
            "nick",
            null,
            new AuthDefaultDateTime(LocalDateTime.now(), LocalDateTime.now())));

    given()
        .contentType(ContentType.JSON)
        .body(new AppendAuthUserRequest(
            "test@test.com", "password!", "nick",  UUID.randomUUID()))
        .post("/users")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-user",
            requestFields(
                fieldWithPath("username")
                    .type(JsonFieldType.STRING)
                    .description("생성할 user 아이디")
                    .attributes(RestDocsUtils.constraints("유저 아이디는 영어 대소문자, 숫자 포함 4~16자리여야 합니다.")),
                fieldWithPath("password")
                    .type(JsonFieldType.STRING)
                    .description("생성할 user 비밀번호")
                    .attributes(RestDocsUtils.constraints(
                        "비밀번호는 영어 대소문자, 숫자, 특수문자(!@#$%^&*()_+-=~) 포함 8~16자리여야 합니다.")),
                fieldWithPath("nickname")
                    .type(JsonFieldType.STRING)
                    .description("생성할 user 닉네임")
                    .attributes(RestDocsUtils.constraints("닉네임은 한글, 영어, 숫자 포함 2~6자리여야 합니다")),
                fieldWithPath("phoneNumber")
                    .type(JsonFieldType.STRING)
                    .description("생성할 user 전화번호")
                    .attributes(RestDocsUtils.constraints("휴대폰 번호는 10 ~ 11자리의 숫자여야 합니다.")),
                fieldWithPath("verificationCodeId")
                    .type(JsonFieldType.STRING)
                    .description("인증 코드 식별자")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("생성된 user id"))));
  }

  @Test
  void findMe() {

    AuthUser authUser = new AuthUser(
        1L,
        "test@test.com",
        "password",
        "닉네임",
        "http://profile.image.url",
        new AuthDefaultDateTime(LocalDateTime.now(), LocalDateTime.now()));

    when(authUserService.findUser(any())).thenReturn(authUser);

    given()
        .contentType(ContentType.JSON)
        .get("/users/me")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-me",
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("user id"),
                fieldWithPath("data.username").type(JsonFieldType.STRING).description("user 유저네임"),
                fieldWithPath("data.nickname").type(JsonFieldType.STRING).description("user 닉네임"),
                fieldWithPath("data.phoneNumber")
                    .type(JsonFieldType.STRING)
                    .description("user 전화번호"),
                fieldWithPath("data.profileImageUrl")
                    .type(JsonFieldType.STRING)
                    .description("user 프로필 이미지 URL"))));
  }

  @Test
  void checkUsernameIsUnique() {
    given()
        .contentType(ContentType.JSON)
        .queryParam("username", "아이디")
        .get("/users/username/is-unique")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "check-username",
            queryParameters(parameterWithName("username")
                .description("중복검사 할 아이디")
                .attributes(RestDocsUtils.constraints("20자 이하"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.isUnique")
                    .type(JsonFieldType.BOOLEAN)
                    .description("사용자 username이 고유한지 여부 (true: 사용 가능, false: 중복)"))));
  }

  @Test
  void checkNicknameIsUnique() {
    given()
        .contentType(ContentType.JSON)
        .queryParam("nickname", "닉네임")
        .get("/users/nickname/is-unique")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "check-nickname",
            queryParameters(parameterWithName("nickname")
                .description("중복검사 할 닉네임")
                .attributes(RestDocsUtils.constraints("36자 이하"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.isUnique")
                    .type(JsonFieldType.BOOLEAN)
                    .description("사용자 nickname이 고유한지 여부 (true: 사용 가능, false: 중복)"))));
  }

  @Test
  void modifyNickname() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyNicknameRequest("새로운닉네임"))
        .patch("/users/nickname")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-nickname",
            requestFields(fieldWithPath("nickname")
                .type(JsonFieldType.STRING)
                .description("새로운 nickname")
                .attributes(RestDocsUtils.constraints("36자 이하"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }

  @Test
  void modifyPassword() {
    given()
        .contentType(ContentType.JSON)
        .body(new ModifyPasswordRequest("oldPassword", "newPassword"))
        .patch("/users/password")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-password",
            requestFields(
                fieldWithPath("oldPassword").type(JsonFieldType.STRING).description("기존 비밀번호"),
                fieldWithPath("newPassword")
                    .type(JsonFieldType.STRING)
                    .description("새 비밀번호")
                    .attributes(RestDocsUtils.constraints(
                        "비밀번호는 영어 대소문자, 숫자, 특수문자(!@#$%^&*()_+-=~) 포함 8~16자리여야 합니다."))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }

  @Test
  void modifyProfileImage() {
    when(authImageService.uploadImage(any())).thenReturn("http://dummy.image.url");

    given()
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .multiPart("profileImage", "test.jpg", new byte[0], "image/jpeg")
        .patch("users/profile-image")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-profile-image",
            requestParts(partWithName("profileImage").description("변경할 프로필 이미지")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }

  @Test
  void resetPassword() {
    given()
        .contentType(ContentType.JSON)
        .body(new ResetPasswordRequest("username", "newPassword", UUID.randomUUID()))
        .patch("/users/password/reset")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "reset-password",
            requestFields(
                fieldWithPath("username")
                    .type(JsonFieldType.STRING)
                    .description("비밀번호 초기화할 사용자 유저네임")
                    .attributes(RestDocsUtils.constraints("유저 아이디는 영어 대소문자, 숫자 포함 4~16자리여야 합니다.")),
                fieldWithPath("newPassword")
                    .type(JsonFieldType.STRING)
                    .description("변경할 비밀번호")
                    .attributes(RestDocsUtils.constraints(
                        "비밀번호는 영어 대소문자, 숫자, 특수문자(!@#$%^&*()_+-=~) 포함 8~16자리여야 합니다.")),
                fieldWithPath("verificationCodeId")
                    .type(JsonFieldType.STRING)
                    .description("인증 코드 식별자")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }
}

package com.ssafy.taskit.auth.api.controller.verification;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;

import builder.VerificationCodeBuilder;
import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import com.ssafy.s12p21d206.achu.test.api.RestDocsUtils;
import com.ssafy.taskit.auth.domain.verification.EmailVerificationService;
import com.ssafy.taskit.auth.domain.verification.VerificationPurpose;
import io.restassured.http.ContentType;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

// sonarqube에서 test에 assertions이 없더라도 code smell로 인식하지 않음
@SuppressWarnings("java:S2699")
class EmailVerificationControllerTest extends RestDocsTest {

  private EmailVerificationController controller;
  private EmailVerificationService emailVerificationService;

  @BeforeEach
  void setup() {
    emailVerificationService = mock(EmailVerificationService.class);
    controller = new EmailVerificationController(emailVerificationService);
    mockMvc = mockController(controller);
  }

  @Test
  void requestVerification() {
    when(emailVerificationService.issuePhoneVerificationCode(any(), any()))
        .thenReturn(VerificationCodeBuilder.createNonVerified(
            VerificationPurpose.SIGN_UP, LocalDateTime.now()));

    given()
        .contentType(ContentType.JSON)
        .body(new EmailVerificationRequest("01012341234", VerificationPurpose.SIGN_UP))
        .post("/verification/request")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "request-verification",
            requestFields(
                fieldWithPath("phoneNumber")
                    .type(JsonFieldType.STRING)
                    .description("생성할 user 아이디")
                    .attributes(RestDocsUtils.constraints("11자리 전화번호 숫자")),
                fieldWithPath("purpose")
                    .type(JsonFieldType.STRING)
                    .description("인증 목적")
                    .attributes(
                        RestDocsUtils.constraints(
                            "SIGN_UP(회원가입), CHANGE_PASSWORD(비밀번호 변경), RESET_PASSWORD(비밀번호 초기화), CHANGE_PHONE_NUMBER(전화번호 변경)"))),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.id").type(JsonFieldType.STRING).description("생성된 인증 번호 id"),
                fieldWithPath("data.expiresIn")
                    .type(JsonFieldType.STRING)
                    .description("ISO 8601 표준 duration, 인증 번호 인증 가능 만료 기간"))));
  }

  @Test
  void verifyVerification() {

    given()
        .contentType(ContentType.JSON)
        .body(new VerifyVerificationCodeRequest(UUID.randomUUID(), "123456"))
        .post("/verification/verify")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "verify-verification",
            requestFields(
                fieldWithPath("id")
                    .type(JsonFieldType.STRING)
                    .description("인증 코드 생성 시 받은 인증 코드 식별자")
                    .attributes(RestDocsUtils.constraints("UUID")),
                fieldWithPath("code")
                    .type(JsonFieldType.STRING)
                    .description("인증 코드")
                    .attributes(RestDocsUtils.constraints("6자리 숫자"))),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 (예: SUCCESS 혹은 ERROR)"))));
  }
}

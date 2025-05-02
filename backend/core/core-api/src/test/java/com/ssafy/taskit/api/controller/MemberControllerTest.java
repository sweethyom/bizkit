package com.ssafy.taskit.api.controller;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;

class MemberControllerTest extends RestDocsTest {

    private MemberController controller;
    @BeforeEach
    public void setup(){
        controller= new MemberController();
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
                                fieldWithPath("data.[].nickname").type(JsonFieldType.STRING).description("현재 소속된 팀원 닉네임"),
                                fieldWithPath("data.[].email").type(JsonFieldType.STRING).description("현재 소속된 팀원 이메일"),
                                fieldWithPath("data.[].profileImage").type(JsonFieldType.STRING).description("현재 소속된 팀원 프로필 이미지"),
                                fieldWithPath("data.[].leader").type(JsonFieldType.BOOLEAN).description("현재 소속된 팀원의 팀장 여부")
                        )
                ));
    }
        }
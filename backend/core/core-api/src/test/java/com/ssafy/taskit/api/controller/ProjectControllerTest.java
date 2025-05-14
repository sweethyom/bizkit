package com.ssafy.taskit.api.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.*;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import com.ssafy.s12p21d206.achu.test.api.RestDocsUtils;
import com.ssafy.taskit.domain.*;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import io.restassured.http.ContentType;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;

class ProjectControllerTest extends RestDocsTest {
  ProjectController controller;
  ProjectService projectService;
  UserService userService;

  ProjectImageFacade projectImageFacade;

  @BeforeEach
  public void setup() {
    projectService = mock(ProjectService.class);
    userService = mock(UserService.class);
    projectImageFacade = mock(ProjectImageFacade.class);
    controller = new ProjectController(projectService, projectImageFacade, userService);
    mockMvc = mockController(controller);
  }

  @Test
  public void appendProject() {
    when(projectService.append(any(User.class), any(NewProject.class))).thenReturn(1L);
    given()
        .contentType(ContentType.JSON)
        .multiPart("request", new AppendProjectRequest("프로젝트 이름1", "프로젝트 키"), "application/json")
        .post("/projects")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-project",
            requestPartFields(
                "request",
                fieldWithPath("name")
                    .type(JsonFieldType.STRING)
                    .attributes(RestDocsUtils.constraints("최대 40byte (앞뒤 공백 불가)"))
                    .description("생성할 프로젝트 이름"),
                fieldWithPath("key")
                    .type(JsonFieldType.STRING)
                    .attributes(RestDocsUtils.constraints("최대 10byte (대문자 및 숫자만 가능, 앞뒤 공백 불가)"))
                    .description("생성할 프로젝트의 키")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("생성된 프로젝트의 id"))));
  }

  @Test
  public void findProjects() {
    DefaultDateTime now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());
    DefaultDateTime older = new DefaultDateTime(
        LocalDateTime.now().minusDays(1), LocalDateTime.now().minusDays(1));
    DefaultDateTime oldest = new DefaultDateTime(
        LocalDateTime.now().minusDays(2), LocalDateTime.now().minusDays(2));
    Project project1 = new Project(1L, 1L, "프로젝트1", "SFE213FE", 0, null, now);
    Project project2 = new Project(2L, 1L, "프로젝트1", "SFE213FE", 0, null, oldest);
    Project project3 = new Project(3L, 1L, "프로젝트2", "SFE213FEFE", 0, null, older);
    when(projectService.findProjects(any(User.class), eq(ProjectSort.RECENT_VIEW)))
        .thenReturn(List.of(project1, project3, project2));
    given()
        .contentType(ContentType.JSON)
        .queryParam("cursor", "2")
        .queryParam("sort", "RECENT_VIEW")
        .get("/projects")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-projects",
            queryParameters(
                parameterWithName("cursor")
                    .optional()
                    .description("페이지네이션 커서, 이전 페이지의 마지막 프로젝트 ID를 입력.첫 페이지 요청 시 생략하거나 빈값으로 요청)"),
                parameterWithName("sort") // sort 파라미터 문서화 추가
                    .optional()
                    .description(
                        "정렬 기준 (RECENT_VIEW: 최근 조회순, OLD_VIEW: 오래된 조회순, NAME_DESC: 이름 내림차순, 기본값: RECENT_VIEW)")),
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
                    .description("내가 속한 프로젝트 이미지 경로")
                    .optional(),
                fieldWithPath("data.[].todoCount")
                    .type(JsonFieldType.NUMBER)
                    .description("프로젝트 내 나의 할 일 개수"))));
  }

  @Test
  public void findProject() {
    DefaultDateTime now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());
    Project project = new Project(1L, 1L, "프로젝트1", "SFE213FE", 0, null, now);
    ProjectDetail projectDetail = new ProjectDetail(project, true);
    when(projectService.findProject(any(), anyLong())).thenReturn(projectDetail);
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
                fieldWithPath("data.key").type(JsonFieldType.STRING).description("내가 속한 프로젝트의 키"),
                fieldWithPath("data.image")
                    .type(JsonFieldType.STRING)
                    .description("내가 속한 프로젝트 이미지 경로")
                    .optional(),
                fieldWithPath("data.leader")
                    .type(JsonFieldType.BOOLEAN)
                    .description("프로젝트 팀장 여부"))));
  }

  @Test
  public void modifyProjectName() {
    DefaultDateTime now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());
    Project project = new Project(1L, 1L, "프로젝트1", "SFE213FE", 0, null, now);
    ProjectDetail projectDetail = new ProjectDetail(project, true);
    when(projectService.modifyProjectName(any(), anyLong(), anyString())).thenReturn(projectDetail);
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
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .multiPart("projectImage", "modify-test.jpg", new byte[0], "image/jpeg")
        .patch("projects/{projectId}/image", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "modify-project-image",
            pathParameters(parameterWithName("projectId").description("이미지를 수정할 프로젝트 id")),
            requestParts(partWithName("projectImage").description("수정할 프로젝트 이미지파일")),
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
    DefaultDateTime now = new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now());
    Project project = new Project(1L, 1L, "프로젝트1", "SFE213FE", 0, null, now);
    UserDetail user = new UserDetail(1L, "사용자1", "https://img.com/a.jpg", "user1@example.com");
    when(projectService.findInvitationProject(any(), anyString())).thenReturn(project);
    when(userService.findUserDetail(anyLong())).thenReturn(user);
    given()
        .contentType(ContentType.JSON)
        .get("projects/invitation/{invitationCode}", "초대코드")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "find-invitation-project",
            pathParameters(parameterWithName("invitationCode").description("프로젝트 초대 코드")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 (예: SUCCESS 혹은 ERROR)"),
                fieldWithPath("data.id").type(JsonFieldType.NUMBER).description("초대된 프로젝트 id"),
                fieldWithPath("data.name").type(JsonFieldType.STRING).description("초대된 프로젝트 이름"),
                fieldWithPath("data.image")
                    .type(JsonFieldType.STRING)
                    .description("초대된 프로젝트 이미지")
                    .optional(),
                fieldWithPath("data.leader.id")
                    .type(JsonFieldType.NUMBER)
                    .description("초대한 프로젝트 팀장 id"),
                fieldWithPath("data.leader.nickname")
                    .type(JsonFieldType.STRING)
                    .description("초대한 프로젝트 팀장 닉네임"),
                fieldWithPath("data.leader.profileImgUrl")
                    .type(JsonFieldType.STRING)
                    .description("초대한 프로젝트 팀장 이미지"))));
  }
}

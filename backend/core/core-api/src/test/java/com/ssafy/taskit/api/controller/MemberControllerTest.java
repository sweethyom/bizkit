package com.ssafy.taskit.api.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.pathParameters;

import com.ssafy.s12p21d206.achu.test.api.RestDocsTest;
import com.ssafy.taskit.domain.*;
import com.ssafy.taskit.domain.support.DefaultDateTime;
import io.restassured.http.ContentType;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.restdocs.payload.JsonFieldType;

class MemberControllerTest extends RestDocsTest {

  private MemberController controller;
  private MemberService memberService;
  private UserService userService;
  private IssueService issueService;

  @BeforeEach
  public void setup() {
    memberService = mock(MemberService.class);
    userService = mock(UserService.class);
    issueService = mock(IssueService.class);
    controller = new MemberController(memberService, userService, issueService);
    mockMvc = mockController(controller);
  }

  @Test
  public void findMembers() {
    DefaultDateTime time = new DefaultDateTime(
        LocalDateTime.now().minusDays(1), LocalDateTime.now().minusDays(1));
    Member member1 = new Member(1L, 1L, 1L, Role.LEADER, LocalDateTime.now().minusDays(1), time);
    Member member2 = new Member(2L, 2L, 1L, Role.MEMBER, LocalDateTime.now().minusDays(1), time);
    Member member3 = new Member(3L, 3L, 1L, Role.MEMBER, LocalDateTime.now().minusDays(1), time);

    UserDetail user1 = new UserDetail(1L, "사용자1", "user1@example.com", "https://img.com/a.jpg");
    UserDetail user2 = new UserDetail(2L, "사용자2", "user2@example.com", "https://img.com/b.jpg");
    UserDetail user3 = new UserDetail(3L, "사용자3", "user3@example.com", "https://img.com/c.jpg");
    List<UserDetail> users = List.of(user1, user2, user3);

    when(memberService.findMembers(any(User.class), anyLong()))
        .thenReturn(List.of(member1, member2, member3));
    when(userService.findUserDetailsByIds(anyList())).thenReturn(List.of(user1, user2, user3));
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
                fieldWithPath("data.[].userId")
                    .type(JsonFieldType.NUMBER)
                    .description("현재 소속된 팀원의 유저 id"),
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
    DefaultDateTime time = new DefaultDateTime(
        LocalDateTime.now().minusDays(1), LocalDateTime.now().minusDays(1));
    Invitation invitation1 =
        new Invitation(1L, 1L, "user1@example.com", 1L, "초대 코드", InvitationStatus.PENDING, time);
    Invitation invitation2 =
        new Invitation(2L, 2L, "user2@example.com", 1L, "초대 코드", InvitationStatus.PENDING, time);
    Invitation invitation3 =
        new Invitation(3L, 3L, "user3@example.com", 1L, "초대 코드", InvitationStatus.PENDING, time);

    UserDetail user1 = new UserDetail(1L, "사용자1", "user1@example.com", "https://img.com/a.jpg");
    UserDetail user2 = new UserDetail(2L, "사용자2", "user2@example.com", "https://img.com/b.jpg");
    UserDetail user3 = new UserDetail(3L, "사용자3", "user3@example.com", "https://img.com/c.jpg");
    List<UserDetail> users = List.of(user1, user2, user3);

    when(memberService.findInvitationMembers(any(User.class), anyLong()))
        .thenReturn(List.of(invitation1, invitation2, invitation3));
    when(userService.findUserDetailsByIds(anyList())).thenReturn(List.of(user1, user2, user3));
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
                fieldWithPath("data.[].invitationCode")
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
  public void appendInvitation() {
    when(memberService.appendInvitation(any(User.class), anyLong(), any(NewInvitation.class)))
        .thenReturn("초대코드");
    given()
        .contentType(ContentType.JSON)
        .body(new AppendInvitationRequest("초대할 팀원의 이메일"))
        .post("projects/{projectId}/members", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "append-Invitation",
            pathParameters(parameterWithName("projectId").description("팀원을 초대할 프로젝트")),
            requestFields(
                fieldWithPath("email").type(JsonFieldType.STRING).description("초대할 팀원의 이메일")),
            responseFields(
                fieldWithPath("result")
                    .type(JsonFieldType.STRING)
                    .description("성공 여부 : SUCCESS 혹은 ERROR"),
                fieldWithPath("data.invitationCode")
                    .type(JsonFieldType.STRING)
                    .description("팀원을 초대한 초대 코드"))));
  }

  @Test
  public void leaveProject() {
    given()
        .contentType(ContentType.JSON)
        .delete("projects/{projectId}/members/me", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "leave-project",
            pathParameters(parameterWithName("projectId").description("나가는 팀원이 속한 프로젝트 id")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void deleteInvitationMember() {
    given()
        .contentType(ContentType.JSON)
        .delete("members/invitation/{invitationCode}", "초대코드")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "delete-invitation-member",
            pathParameters(parameterWithName("invitationCode").description("삭제할 초대된 사용자의 초대 코드")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void deleteMember() {
    when(memberService.findMember(1L))
        .thenReturn(new Member(
            1L,
            1L,
            1L,
            Role.MEMBER,
            LocalDateTime.now(),
            new DefaultDateTime(LocalDateTime.now(), LocalDateTime.now())));
    given()
        .contentType(ContentType.JSON)
        .delete("members/{memberId}", 1L)
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "delete-member",
            pathParameters(parameterWithName("memberId").description("삭제할 팀원 id")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }

  @Test
  public void acceptInvitation() {
    doNothing().when(memberService).acceptInvitation(any(User.class), anyString());
    given()
        .contentType(ContentType.JSON)
        .post("members/invitation/{invitationCode}", "초대코드")
        .then()
        .status(HttpStatus.OK)
        .apply(document(
            "accept-invitation",
            pathParameters(parameterWithName("invitationCode").description("사용자가 수락할 초대 코드")),
            responseFields(fieldWithPath("result")
                .type(JsonFieldType.STRING)
                .description("성공 여부 : SUCCESS 혹은 ERROR"))));
  }
}

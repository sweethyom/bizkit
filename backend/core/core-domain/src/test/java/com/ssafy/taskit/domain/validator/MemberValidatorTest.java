package com.ssafy.taskit.domain.validator;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.ssafy.taskit.domain.MemberRepository;
import com.ssafy.taskit.domain.MemberValidator;
import com.ssafy.taskit.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MemberValidatorTest {
  private MemberRepository memberRepository;

  private MemberValidator memberValidator;

  @BeforeEach
  public void setup() {
    memberRepository = mock(MemberRepository.class);
    memberValidator = new MemberValidator(memberRepository);
  }

  @Test
  void isProjectMember_whenUserIsMember_doesNotThrow() {
    // Given
    User user = mock(User.class);
    when(user.id()).thenReturn(1L);
    Long projectId = 100L;

    when(memberRepository.isMember(1L, projectId)).thenReturn(true);

    // When & Then
    assertDoesNotThrow(() -> memberValidator.validateMember(user, projectId));
  }

  @Test
  void validateMember_whenUserIsMember_doesNotThrow() {

    User user = mock(User.class);
    Long projectId = 1L;
    when(user.id()).thenReturn(100L);
    when(memberRepository.isMember(100L, projectId)).thenReturn(true);
    //    when(memberRepository.isMember(100L, projectId)).thenReturn(false);

    assertDoesNotThrow(() -> memberValidator.validateMember(user, projectId));
  }
}

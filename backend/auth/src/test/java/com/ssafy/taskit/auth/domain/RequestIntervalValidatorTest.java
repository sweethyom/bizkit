package com.ssafy.taskit.auth.domain;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.ssafy.taskit.auth.domain.error.AuthCoreException;
import com.ssafy.taskit.auth.domain.support.AuthDefaultDateTime;
import com.ssafy.taskit.auth.domain.verification.RequestIntervalValidator;
import com.ssafy.taskit.auth.domain.verification.VerificationCode;
import com.ssafy.taskit.auth.domain.verification.VerificationCodeRepository;
import com.ssafy.taskit.auth.domain.verification.VerificationPurpose;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class RequestIntervalValidatorTest {

  @Mock
  private VerificationCodeRepository verificationCodeRepository;

  @InjectMocks
  private RequestIntervalValidator requestIntervalValidator;

  private String email;
  private LocalDateTime now;

  @BeforeEach
  void setUp() {
    email = "test@test.com";
    now = LocalDateTime.now();
  }

  @Test
  void 이전_인증코드가_없는_경우_예외가_발생하지_않는다() {
    // given
    when(verificationCodeRepository.findLatestByPhone(email)).thenReturn(Optional.empty());

    // when & then
    assertThatNoException().isThrownBy(() -> requestIntervalValidator.validate(email));
  }

  @Test
  void 마지막_인증코드_요청_시간이_쿨다운_시간_이내인_경우_예외가_발생한다() {
    // given
    LocalDateTime createdAt = now.minusSeconds(5);
    VerificationCode latestCode = createVerificationCode(createdAt);
    when(verificationCodeRepository.findLatestByPhone(email)).thenReturn(Optional.of(latestCode));
    ReflectionTestUtils.setField(requestIntervalValidator, "requestCooldownSeconds", 10);

    // when & then
    assertThatThrownBy(() -> requestIntervalValidator.validate(email))
        .isInstanceOf(AuthCoreException.class);
  }

  @Test
  void 마지막_인증코드_요청_시간이_쿨다운_시간_이상인_경우_예외가_발생하지_않는다() {
    // given
    LocalDateTime createdAt = now.minusSeconds(15);
    VerificationCode latestCode = createVerificationCode(createdAt);
    when(verificationCodeRepository.findLatestByPhone(email)).thenReturn(Optional.of(latestCode));
    ReflectionTestUtils.setField(requestIntervalValidator, "requestCooldownSeconds", 10);

    // when & then
    assertThatNoException().isThrownBy(() -> requestIntervalValidator.validate(email));
  }

  private VerificationCode createVerificationCode(LocalDateTime createdAt) {
    return new VerificationCode(
        UUID.randomUUID(),
        email,
        "123456",
        VerificationPurpose.SIGN_UP,
        Duration.ofMinutes(5),
        new AuthDefaultDateTime(createdAt, createdAt),
        false);
  }
}

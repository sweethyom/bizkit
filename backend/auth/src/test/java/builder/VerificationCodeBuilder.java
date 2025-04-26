package builder;

import com.ssafy.taskit.auth.domain.support.AuthDefaultDateTime;
import com.ssafy.taskit.auth.domain.verification.VerificationCode;
import com.ssafy.taskit.auth.domain.verification.VerificationPurpose;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

public class VerificationCodeBuilder {
  private VerificationCodeBuilder() {}

  public static VerificationCode createVerified(
      VerificationPurpose purpose, LocalDateTime createdAt) {
    String code = "123456";
    Duration expiresIn = Duration.ofMinutes(3);

    return new VerificationCode(
        UUID.randomUUID(),
        "test@test.com",
        code,
        purpose,
        expiresIn,
        new AuthDefaultDateTime(createdAt, createdAt),
        true);
  }

  public static VerificationCode createNonVerified(
      VerificationPurpose purpose, LocalDateTime createdAt) {
    String code = "123456";
    Duration expiresIn = Duration.ofMinutes(3);

    return new VerificationCode(
        UUID.randomUUID(),
        "test@test.com",
        code,
        purpose,
        expiresIn,
        new AuthDefaultDateTime(createdAt, createdAt),
        false);
  }
}

package com.ssafy.taskit.auth.domain.user;

import org.springframework.security.crypto.password.PasswordEncoder;

public class NewAuthUser {

  private final String email;
  private String password;
  private final String nickname;

  private boolean isEncoded;

  public NewAuthUser(String email, String password, String nickname) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.isEncoded = false;
  }

  public void encodePassword(PasswordEncoder passwordEncoder) {
    this.password = passwordEncoder.encode(this.password);
    isEncoded = true;
  }

  public String username() {
    return email;
  }

  public String password() {
    if (!isEncoded) {
      throw new AssertionError("password getter는 엔코드 후에 호출할 수 있습니다.");
    }
    return password;
  }

  public String nickname() {
    return nickname;
  }

  public String email() {
    return email;
  }
}

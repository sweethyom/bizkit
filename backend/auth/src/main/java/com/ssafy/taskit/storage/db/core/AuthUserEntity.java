package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.auth.domain.support.AuthDefaultDateTime;
import com.ssafy.taskit.auth.domain.user.AuthUser;
import com.ssafy.taskit.auth.domain.user.NewAuthUser;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "`user`")
@Entity
public class AuthUserEntity extends AuthBaseEntity {

  private String email;
  private String password;
  private String nickname;
  private String profileImageUrl;

  protected AuthUserEntity() {}

  public AuthUserEntity(String email, String password, String nickname, String profileImageUrl) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.profileImageUrl = profileImageUrl;
  }

  public static AuthUserEntity from(NewAuthUser newAuthUser) {
    return new AuthUserEntity(
        newAuthUser.email(), newAuthUser.password(), newAuthUser.nickname(), null);
  }

  public AuthUser toAuthUser() {
    return new AuthUser(
        this.getId(),
        this.email,
        this.password,
        this.nickname,
        this.profileImageUrl,
        new AuthDefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
  }

  public void changeNickname(String nickname) {
    this.nickname = nickname;
  }

  public void changePassword(String password) {
    this.password = password;
  }

  public void changeProfileImageUrl(String profileImageUrl) {
    this.profileImageUrl = profileImageUrl;
  }
}

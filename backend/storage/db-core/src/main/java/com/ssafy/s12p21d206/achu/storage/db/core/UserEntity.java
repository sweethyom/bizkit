package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.UserDetail;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

@Immutable
@Table(name = "`user`")
@Entity
public class UserEntity extends BaseEntity {

  public String nickname;
  private String profileImageUrl;

  protected UserEntity() {}

  public UserDetail toUserDetail() {
    return new UserDetail(this.getId(), this.nickname, this.profileImageUrl);
  }

  public String getNickname() {
    return nickname;
  }

  public String getProfileImageUrl() {
    return profileImageUrl;
  }
}

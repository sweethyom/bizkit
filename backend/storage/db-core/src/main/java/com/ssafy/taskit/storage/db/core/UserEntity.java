package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.UserDetail;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

@Immutable
@Table(name = "`user`")
@Entity
public class UserEntity extends BaseEntity {

  private String nickname;
  private String profileImgUrl;

  private String email;

  protected UserEntity() {}

  public UserDetail toUserDetail() {
    return new UserDetail(this.getId(), this.nickname, this.profileImgUrl, this.email);
  }
}

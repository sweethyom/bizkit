package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.Baby;
import com.ssafy.s12p21d206.achu.domain.Sex;
import com.ssafy.s12p21d206.achu.domain.support.DefaultDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Table(name = "baby")
@Entity
public class BabyEntity extends BaseEntity {

  private Long userId;

  private String nickname;

  @Enumerated(EnumType.STRING)
  private Sex gender;

  private String imageUrl;

  private LocalDate birth;

  protected BabyEntity() {}

  public BabyEntity(Long userId, String nickname, Sex gender, String imageUrl, LocalDate birth) {
    this.userId = userId;
    this.nickname = nickname;
    this.gender = gender;
    this.imageUrl = imageUrl;
    this.birth = birth;
  }

  public Baby toBaby() {
    return new Baby(
        this.getId(),
        this.userId,
        this.nickname,
        this.gender,
        this.imageUrl,
        this.birth,
        new DefaultDateTime(this.getCreatedAt(), this.getUpdatedAt()));
  }

  public void changeNickname(String nickname) {
    this.nickname = nickname;
  }

  public void changeBirth(LocalDate birth) {
    this.birth = birth;
  }

  public void changeGender(Sex gender) {
    this.gender = gender;
  }

  public void changeImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }
}

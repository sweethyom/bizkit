package com.ssafy.s12p21d206.achu.storage.db.core;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name = "preference_score")
@Entity
public class PreferenceScoreEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long babyId;
  private Long goodsId;

  private Long score;

  protected PreferenceScoreEntity() {}

  public PreferenceScoreEntity(Long babyId, Long goodsId, Long score) {
    this.babyId = babyId;
    this.goodsId = goodsId;
    this.score = score;
  }

  public void addScore(Long score) {
    this.score += score;
  }
}

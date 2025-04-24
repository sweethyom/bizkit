package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.PreferenceScoreRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class PreferenceScoreCoreRepository implements PreferenceScoreRepository {

  private final PreferenceScoreJpaRepository jpaRepository;

  public PreferenceScoreCoreRepository(PreferenceScoreJpaRepository jpaRepository) {
    this.jpaRepository = jpaRepository;
  }

  @Transactional
  public void addScore(Long babyId, Long goodsId, Long score) {
    PreferenceScoreEntity preferenceScoreEntity = jpaRepository
        .findByBabyIdAndGoodsId(babyId, goodsId)
        .orElseGet(() -> new PreferenceScoreEntity(babyId, goodsId, 0L));

    preferenceScoreEntity.addScore(score);
  }
}

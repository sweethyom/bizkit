package com.ssafy.s12p21d206.achu.storage.db.core;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreferenceScoreJpaRepository extends JpaRepository<PreferenceScoreEntity, Long> {

  Optional<PreferenceScoreEntity> findByBabyIdAndGoodsId(Long babyId, Long goodsId);
}

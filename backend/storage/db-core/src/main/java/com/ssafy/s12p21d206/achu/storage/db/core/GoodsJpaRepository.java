package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.TradeStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodsJpaRepository extends JpaRepository<GoodsEntity, Long> {
  List<GoodsEntity> findByTradeStatusAndEntityStatus(
      Pageable pageable, TradeStatus tradeStatus, EntityStatus entityStatus);

  List<GoodsEntity> findByCategoryIdAndTradeStatusAndEntityStatus(
      Long categoryId, Pageable pageable, TradeStatus tradeStatus, EntityStatus entityStatus);

  boolean existsByIdAndEntityStatus(Long goodsId, EntityStatus entityStatus);

  Optional<GoodsEntity> findByIdAndEntityStatus(Long id, EntityStatus entityStatus);

  boolean existsByIdAndUserId(Long id, Long userId);

  boolean existsByIdAndTradeStatus(Long id, TradeStatus tradeStatus);

  List<GoodsEntity> findByTitleContainingAndTradeStatusAndEntityStatus(
      String keyword, Pageable pageable, TradeStatus tradeStatus, EntityStatus entityStatus);

  List<GoodsEntity> findByCategoryIdAndTitleContainingAndTradeStatusAndEntityStatus(
      Long categoryId,
      String keyword,
      Pageable pageable,
      TradeStatus tradeStatus,
      EntityStatus entityStatus);

  List<GoodsEntity> findByIdInAndEntityStatus(List<Long> ids, EntityStatus entityStatus);

  List<GoodsEntity> findByUserIdAndEntityStatus(
      Long userId, EntityStatus entityStatus, Pageable pageable);
}

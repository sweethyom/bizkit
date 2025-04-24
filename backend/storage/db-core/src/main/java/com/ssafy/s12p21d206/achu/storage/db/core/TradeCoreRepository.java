package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.*;
import com.ssafy.s12p21d206.achu.domain.error.CoreErrorType;
import com.ssafy.s12p21d206.achu.domain.error.CoreException;
import com.ssafy.s12p21d206.achu.domain.support.SortType;
import com.ssafy.s12p21d206.achu.storage.db.core.support.SortUtils;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class TradeCoreRepository implements TradeRepository {
  private final TradeJpaRepository tradeJpaRepository;
  private final GoodsJpaRepository goodsJpaRepository;

  public TradeCoreRepository(
      TradeJpaRepository tradeJpaRepository, GoodsJpaRepository goodsJpaRepository) {
    this.tradeJpaRepository = tradeJpaRepository;
    this.goodsJpaRepository = goodsJpaRepository;
  }

  @Override
  public Trade save(User user, Long goodsId, NewTrade newTrade) {
    TradeEntity tradeEntity =
        tradeJpaRepository.save(new TradeEntity(goodsId, user.id(), newTrade.buyerId()));
    GoodsEntity goodsEntity = goodsJpaRepository
        .findById(goodsId)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    goodsEntity.sold();
    goodsJpaRepository.save(goodsEntity);
    return tradeEntity.toTrade();
  }

  @Override
  public List<Trade> findTradedGoods(
      User user, TradeType tradeType, Long offset, Long limit, SortType sort) {
    Pageable pageable =
        PageRequest.of(offset.intValue(), limit.intValue(), SortUtils.convertSort(sort));
    List<TradeEntity> tradeEntities = tradeJpaRepository.findByUserIdAndEntityStatus(
        user.id(), tradeType.name(), pageable, EntityStatus.ACTIVE);
    return tradeEntities.stream().map(TradeEntity::toTrade).toList();
  }
}

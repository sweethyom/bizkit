package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.Trade;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "trade")
@Entity
public class TradeEntity extends BaseEntity {
  private Long goodsId;

  private Long sellerId;

  private Long buyerId;

  protected TradeEntity() {}

  public TradeEntity(Long goodsId, Long sellerId, Long buyerId) {
    this.goodsId = goodsId;
    this.sellerId = sellerId;
    this.buyerId = buyerId;
  }

  public Trade toTrade() {
    return new Trade(getId(), this.goodsId, this.sellerId, this.buyerId);
  }
}

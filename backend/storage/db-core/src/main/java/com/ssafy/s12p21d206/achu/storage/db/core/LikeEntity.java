package com.ssafy.s12p21d206.achu.storage.db.core;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Table(name = "`like`")
@Entity
public class LikeEntity extends BaseEntity {
  private Long userId;

  private Long goodsId;

  protected LikeEntity() {}

  public LikeEntity(Long userId, Long goodsId) {
    this.userId = userId;
    this.goodsId = goodsId;
  }

  public Long getGoodsId() {
    return goodsId;
  }

  public Long getUserId() {
    return userId;
  }
}

package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.*;
import com.ssafy.s12p21d206.achu.domain.support.DefaultDateTime;
import com.ssafy.s12p21d206.achu.storage.db.core.converter.ImgUrlListJsonConverter;
import jakarta.persistence.*;
import java.util.List;

@Table(name = "goods")
@Entity
public class GoodsEntity extends BaseEntity {

  private String title;

  private String description;

  private String thumbnailImageUrl;

  @Convert(converter = ImgUrlListJsonConverter.class)
  @Column(name = "imgUrls", columnDefinition = "json")
  private List<String> imgUrls;

  @Enumerated(EnumType.STRING)
  @Column(name = "tradeStatus", columnDefinition = "VARCHAR")
  private TradeStatus tradeStatus = TradeStatus.SELLING;

  private Long price;

  private Long categoryId;

  private Long userId;

  private Long babyId;

  protected GoodsEntity() {}

  public GoodsEntity(
      String title,
      String description,
      String thumbnailImageUrl,
      List<String> imgUrls,
      TradeStatus tradeStatus,
      Long price,
      Long categoryId,
      Long userId,
      Long babyId) {
    this.title = title;
    this.description = description;
    this.thumbnailImageUrl = thumbnailImageUrl;
    this.imgUrls = imgUrls;
    this.tradeStatus = tradeStatus;
    this.price = price;
    this.categoryId = categoryId;
    this.userId = userId;
    this.babyId = babyId;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public Goods toGoods() {
    return new Goods(
        getId(),
        this.title,
        this.description,
        new ImageUrlsWithThumbnail(this.thumbnailImageUrl, this.imgUrls),
        this.tradeStatus,
        this.price,
        new DefaultDateTime(getCreatedAt(), getUpdatedAt()),
        this.categoryId,
        new User(this.userId),
        this.babyId);
  }

  public GoodsDetail toGoodsDetail(Category category) {
    return new GoodsDetail(
        new Goods(
            getId(),
            this.title,
            this.description,
            new ImageUrlsWithThumbnail(this.thumbnailImageUrl, this.imgUrls),
            this.tradeStatus,
            this.price,
            new DefaultDateTime(getCreatedAt(), getUpdatedAt()),
            this.categoryId,
            new User(this.userId),
            this.babyId),
        category);
  }

  public void updateText(ModifyGoods modifyGoods) {
    this.title = modifyGoods.title();
    this.description = modifyGoods.description();
    this.price = modifyGoods.price();
    this.categoryId = modifyGoods.categoryId();
  }

  public void sold() {
    this.tradeStatus = TradeStatus.SOLD;
  }

  public void changeImages(ImageUrlsWithThumbnail imageUrlsWithThumbnail) {
    this.thumbnailImageUrl = imageUrlsWithThumbnail.thumbnailImageUrl();
    this.imgUrls = imageUrlsWithThumbnail.imageUrls();
  }
}

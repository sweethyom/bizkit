package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.*;
import com.ssafy.s12p21d206.achu.domain.TradeStatus;
import com.ssafy.s12p21d206.achu.domain.error.CoreErrorType;
import com.ssafy.s12p21d206.achu.domain.error.CoreException;
import com.ssafy.s12p21d206.achu.domain.support.SortType;
import com.ssafy.s12p21d206.achu.storage.db.core.support.SortUtils;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class GoodsCoreRepository implements GoodsRepository {

  private final GoodsJpaRepository goodsJpaRepository;
  private final CategoryJpaRepository categoryJpaRepository;

  public GoodsCoreRepository(
      GoodsJpaRepository goodsJpaRepository, CategoryJpaRepository categoryJpaRepository) {
    this.goodsJpaRepository = goodsJpaRepository;
    this.categoryJpaRepository = categoryJpaRepository;
  }

  @Override
  public GoodsDetail save(
      User user, NewGoods newGoods, ImageUrlsWithThumbnail imageUrlsWithThumbnail) {
    CategoryEntity categoryEntity = categoryJpaRepository
        .findById(newGoods.categoryId())
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    return goodsJpaRepository
        .save(new GoodsEntity(
            newGoods.title(),
            newGoods.description(),
            imageUrlsWithThumbnail.thumbnailImageUrl(),
            imageUrlsWithThumbnail.imageUrls(),
            TradeStatus.SELLING,
            newGoods.price(),
            newGoods.categoryId(),
            user.id(),
            newGoods.babyId()))
        .toGoodsDetail(categoryEntity.toCategory());
  }

  @Transactional
  @Override
  public GoodsDetail modifyGoods(Long id, ModifyGoods modifyGoods) {
    GoodsEntity goods = goodsJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    CategoryEntity categoryEntity = categoryJpaRepository
        .findById(modifyGoods.categoryId())
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    goods.updateText(modifyGoods);
    return goods.toGoodsDetail(categoryEntity.toCategory());
  }

  @Override
  public boolean isSelling(Long id) {
    return goodsJpaRepository.existsByIdAndTradeStatus(id, TradeStatus.SELLING);
  }

  @Transactional
  @Override
  public Long delete(Long id) {
    GoodsEntity goods = goodsJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    goods.delete();
    return goods.getId();
  }

  @Transactional
  @Override
  public Goods modifyImages(Long goodsId, ImageUrlsWithThumbnail imageUrlsWithThumbnail) {
    GoodsEntity goods = goodsJpaRepository
        .findByIdAndEntityStatus(goodsId, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    goods.changeImages(imageUrlsWithThumbnail);
    return goods.toGoods();
  }

  @Override
  public List<Goods> findGoods(User user, Long offset, Long limit, SortType sort) {
    Pageable pageable =
        PageRequest.of(offset.intValue(), limit.intValue(), SortUtils.convertSort(sort));
    List<GoodsEntity> goodsEntities = goodsJpaRepository.findByTradeStatusAndEntityStatus(
        pageable, TradeStatus.SELLING, EntityStatus.ACTIVE);
    return goodsEntities.stream().map(GoodsEntity::toGoods).toList();
  }

  @Override
  public List<Goods> findCategoryGoods(
      User user, Long categoryId, Long offset, Long limit, SortType sort) {
    Pageable pageable =
        PageRequest.of(offset.intValue(), limit.intValue(), SortUtils.convertSort(sort));
    List<GoodsEntity> goodsEntities =
        goodsJpaRepository.findByCategoryIdAndTradeStatusAndEntityStatus(
            categoryId, pageable, TradeStatus.SELLING, EntityStatus.ACTIVE);
    return goodsEntities.stream().map(GoodsEntity::toGoods).toList();
  }

  @Override
  public boolean existsById(Long goodsId) {
    return goodsJpaRepository.existsByIdAndEntityStatus(goodsId, EntityStatus.ACTIVE);
  }

  @Override
  public List<Goods> findGoodsByIds(List<Long> ids) {

    List<GoodsEntity> goodsEntities =
        goodsJpaRepository.findByIdInAndEntityStatus(ids, EntityStatus.ACTIVE);
    Map<Long, GoodsEntity> entityMap =
        goodsEntities.stream().collect(Collectors.toMap(GoodsEntity::getId, Function.identity()));

    return ids.stream()
        .map(entityMap::get)
        .filter(Objects::nonNull)
        .map(GoodsEntity::toGoods)
        .toList();
  }

  @Override
  public GoodsDetail findGoodsDetail(Long id) {
    GoodsEntity goodsEntity = goodsJpaRepository
        .findByIdAndEntityStatus(id, EntityStatus.ACTIVE)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    CategoryEntity categoryEntity = categoryJpaRepository
        .findById(goodsEntity.getCategoryId())
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    return goodsEntity.toGoodsDetail(categoryEntity.toCategory());
  }

  @Override
  public List<Goods> searchGoods(
      User user, String keyword, Long offset, Long limit, SortType sort) {
    Pageable pageable =
        PageRequest.of(offset.intValue(), limit.intValue(), SortUtils.convertSort(sort));
    List<GoodsEntity> goodsEntities =
        goodsJpaRepository.findByTitleContainingAndTradeStatusAndEntityStatus(
            keyword, pageable, TradeStatus.SELLING, EntityStatus.ACTIVE);
    return goodsEntities.stream().map(GoodsEntity::toGoods).toList();
  }

  @Override
  public List<Goods> searchCategoryGoods(
      User user, Long categoryId, String keyword, Long offset, Long limit, SortType sort) {
    Pageable pageable =
        PageRequest.of(offset.intValue(), limit.intValue(), SortUtils.convertSort(sort));
    List<GoodsEntity> goodsEntities =
        goodsJpaRepository.findByCategoryIdAndTitleContainingAndTradeStatusAndEntityStatus(
            categoryId, keyword, pageable, TradeStatus.SELLING, EntityStatus.ACTIVE);

    return goodsEntities.stream().map(GoodsEntity::toGoods).toList();
  }

  @Override
  public boolean existsByIdAndUserId(Long id, Long userId) {
    return goodsJpaRepository.existsByIdAndUserId(id, userId);
  }

  @Override
  public List<Goods> findByUserId(User user, Long offset, Long limit, SortType sort) {
    Pageable pageable =
        PageRequest.of(offset.intValue(), limit.intValue(), SortUtils.convertSort(sort));
    return goodsJpaRepository
        .findByUserIdAndEntityStatus(user.id(), EntityStatus.ACTIVE, pageable)
        .stream()
        .map(GoodsEntity::toGoods)
        .toList();
  }

  @Override
  public Goods findById(Long id) {
    GoodsEntity goods = goodsJpaRepository
        .findById(id)
        .orElseThrow(() -> new CoreException(CoreErrorType.DATA_NOT_FOUND));
    return goods.toGoods();
  }
}

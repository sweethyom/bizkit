package com.ssafy.s12p21d206.achu.storage.db.core;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LikeJpaRepository extends JpaRepository<LikeEntity, Long> {

  int countByGoodsIdAndEntityStatus(Long goodsId, EntityStatus entityStatus);

  boolean existsByUserIdAndGoodsIdAndEntityStatus(Long id, Long goodsId, EntityStatus entityStatus);

  @Query(
      "SELECT l.goodsId, COUNT(l) FROM LikeEntity l WHERE l.goodsId IN :goodsIds AND l.entityStatus = :status GROUP BY l.goodsId")
  List<Object[]> countIn(List<Long> goodsIds, EntityStatus status);

  @Query(
      "SELECT l.goodsId FROM LikeEntity l WHERE l.goodsId IN :goodsIds AND l.userId = :userId AND l.entityStatus = :entityStatus")
  Set<Long> findLikedGoodsByUser(Long userId, List<Long> goodsIds, EntityStatus entityStatus);

  Optional<LikeEntity> findByUserIdAndGoodsId(Long id, Long goodsId);

  List<LikeEntity> findByUserIdAndEntityStatus(
      Long userId, EntityStatus entityStatus, Pageable pageable);

  @Query(
      "select l.userId from LikeEntity l where l.goodsId = :goodsId AND l.entityStatus = :entityStatus")
  Set<Long> findByGoodsIdAndEntityStatus(Long goodsId, EntityStatus entityStatus);
}

package com.ssafy.s12p21d206.achu.storage.db.core;

import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CoreChatRoomJpaRepository extends JpaRepository<CoreChatRoomEntity, Long> {

  @Query(
      "select c.buyerId FROM CoreChatRoomEntity c where c.goodsId = :goodsId AND c.entityStatus = :entityStatus")
  Set<Long> findByGoodsIdAndEntityStatus(Long goodsId, EntityStatus entityStatus);

  @Query(
      """
  select c.goodsId, count(c)
  from CoreChatRoomEntity c
  where c.goodsId in :goodsIds
  and c.entityStatus = :status
  group by c.goodsId
  """)
  List<Object[]> countChatRoomsGroupedByGoodsIds(List<Long> goodsIds, EntityStatus status);
}

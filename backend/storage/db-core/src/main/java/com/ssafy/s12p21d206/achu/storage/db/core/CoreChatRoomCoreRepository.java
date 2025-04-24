package com.ssafy.s12p21d206.achu.storage.db.core;

import com.ssafy.s12p21d206.achu.domain.ChatRoomCountStatus;
import com.ssafy.s12p21d206.achu.domain.CoreChatRoomRepository;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

@Repository
public class CoreChatRoomCoreRepository implements CoreChatRoomRepository {
  private final CoreChatRoomJpaRepository coreChatRoomJpaRepository;

  public CoreChatRoomCoreRepository(CoreChatRoomJpaRepository coreChatRoomJpaRepository) {
    this.coreChatRoomJpaRepository = coreChatRoomJpaRepository;
  }

  @Override
  public Set<Long> findChatUserIds(Long goodsId) {
    return coreChatRoomJpaRepository.findByGoodsIdAndEntityStatus(goodsId, EntityStatus.ACTIVE);
  }

  @Override
  public List<ChatRoomCountStatus> status(List<Long> goodsIds) {
    List<Object[]> result =
        coreChatRoomJpaRepository.countChatRoomsGroupedByGoodsIds(goodsIds, EntityStatus.ACTIVE);

    Map<Long, Long> countMap =
        result.stream().collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

    return goodsIds.stream()
        .map(goodsId -> new ChatRoomCountStatus(goodsId, countMap.getOrDefault(goodsId, 0L)))
        .toList();
  }
}

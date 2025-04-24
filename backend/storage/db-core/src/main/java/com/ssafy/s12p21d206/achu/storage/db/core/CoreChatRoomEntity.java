package com.ssafy.s12p21d206.achu.storage.db.core;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

@Table(name = "chat_room")
@Entity
@Immutable
public class CoreChatRoomEntity extends BaseEntity {
  private Long goodsId;

  private Long sellerId;
  private Long buyerId;

  protected CoreChatRoomEntity() {}
}

package com.ssafy.taskit.storage.db.core;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationJpaRepository extends JpaRepository<InvitationEntity, Long> {
  boolean isInvitationExists(Long userId);
}

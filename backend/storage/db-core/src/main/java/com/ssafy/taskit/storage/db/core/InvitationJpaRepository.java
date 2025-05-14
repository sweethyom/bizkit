package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.InvitationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationJpaRepository extends JpaRepository<InvitationEntity, Long> {
  boolean isInvitationExists(Long userId);

  List<InvitationEntity> findByProjectId(Long projectId);

  InvitationEntity findByInvitationCode(String invitationCode);

  boolean existsByInvitationCodeAndStatus(String invitationCode, InvitationStatus status);
}

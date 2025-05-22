package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.InvitationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationJpaRepository extends JpaRepository<InvitationEntity, Long> {
  boolean existsByUserIdAndProjectIdAndEntityStatus(
      Long userId, Long projectId, EntityStatus entityStatus);

  List<InvitationEntity> findByProjectIdAndStatusAndEntityStatus(
      Long projectId, InvitationStatus invitationstatus, EntityStatus entityStatus);

  InvitationEntity findByInvitationCodeAndEntityStatus(
      String invitationCode, EntityStatus entityStatus);

  boolean existsByInvitationCodeAndStatus(String invitationCode, InvitationStatus status);

  void deleteByInvitationCode(String invitationCode);
}

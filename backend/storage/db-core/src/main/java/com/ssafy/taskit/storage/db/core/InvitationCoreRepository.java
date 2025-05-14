package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Invitation;
import com.ssafy.taskit.domain.InvitationRepository;
import com.ssafy.taskit.domain.NewInvitation;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class InvitationCoreRepository implements InvitationRepository {
  private final InvitationJpaRepository invitationJpaRepository;

  public InvitationCoreRepository(InvitationJpaRepository invitationJpaRepository) {
    this.invitationJpaRepository = invitationJpaRepository;
  }

  @Override
  public boolean isInvitationExists(Long userId) {
    return invitationJpaRepository.isInvitationExists(userId);
  }

  @Override
  public Invitation save(
      Long userId, NewInvitation newInvitation, Long projectId, String invitationCode) {
    return invitationJpaRepository
        .save(new InvitationEntity(userId, newInvitation.email(), projectId, invitationCode))
        .toInvitation();
  }

  @Override
  public List<Invitation> findInvitationMembers(Long projectId) {
    List<InvitationEntity> invitationEntities = invitationJpaRepository.findByProjectId(projectId);
    return invitationEntities.stream().map(InvitationEntity::toInvitation).toList();
  }
}

package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Invitation;
import com.ssafy.taskit.domain.InvitationRepository;
import com.ssafy.taskit.domain.InvitationStatus;
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

  @Override
  public Invitation findByInvitationCode(String invitationCode) {
    InvitationEntity invitation = invitationJpaRepository.findByInvitationCode(invitationCode);
    return invitation.toInvitation();
  }

  @Override
  public boolean existsByInvitationCodeAndStatus(String invitationCode) {
    return invitationJpaRepository.existsByInvitationCodeAndStatus(
        invitationCode, InvitationStatus.PENDING);
  }

  @Override
  public void updateStatus(String invitationCode) {
    InvitationEntity invitation = invitationJpaRepository.findByInvitationCode(invitationCode);
    invitation.accept();
    invitationJpaRepository.save(invitation);
  }

  @Override
  public void deleteInvitationMember(String invitationCode) {
    invitationJpaRepository.deleteByInvitationCode(invitationCode);
  }
}

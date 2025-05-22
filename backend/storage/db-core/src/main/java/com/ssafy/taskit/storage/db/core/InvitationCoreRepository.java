package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Invitation;
import com.ssafy.taskit.domain.InvitationRepository;
import com.ssafy.taskit.domain.InvitationStatus;
import com.ssafy.taskit.domain.NewInvitation;
import java.util.List;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class InvitationCoreRepository implements InvitationRepository {
  private final InvitationJpaRepository invitationJpaRepository;

  public InvitationCoreRepository(InvitationJpaRepository invitationJpaRepository) {
    this.invitationJpaRepository = invitationJpaRepository;
  }

  @Override
  public boolean isInvitationExists(Long userId, Long projectId) {
    return invitationJpaRepository.existsByUserIdAndProjectIdAndEntityStatus(
        userId, projectId, EntityStatus.ACTIVE);
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
    List<InvitationEntity> invitationEntities =
        invitationJpaRepository.findByProjectIdAndStatusAndEntityStatus(
            projectId, InvitationStatus.PENDING, EntityStatus.ACTIVE);
    return invitationEntities.stream().map(InvitationEntity::toInvitation).toList();
  }

  @Override
  public Invitation findByInvitationCode(String invitationCode) {
    InvitationEntity invitation = invitationJpaRepository.findByInvitationCodeAndEntityStatus(
        invitationCode, EntityStatus.ACTIVE);
    return invitation.toInvitation();
  }

  @Override
  public boolean existsByInvitationCode(String invitationCode) {
    return invitationJpaRepository.existsByInvitationCodeAndStatus(
        invitationCode, InvitationStatus.PENDING);
  }

  @Override
  public boolean existsCompletedInvitationByInvitationCode(String invitationCode) {
    return invitationJpaRepository.existsByInvitationCodeAndStatus(
        invitationCode, InvitationStatus.ACCEPTED);
  }

  @Override
  public void accept(String invitationCode) {
    InvitationEntity invitation = invitationJpaRepository.findByInvitationCodeAndEntityStatus(
        invitationCode, EntityStatus.ACTIVE);
    invitation.accept();
    invitationJpaRepository.save(invitation);
  }

  @Transactional
  @Override
  public void deleteInvitationMember(String invitationCode) {
    InvitationEntity byInvitationCode = invitationJpaRepository.findByInvitationCodeAndEntityStatus(
        invitationCode, EntityStatus.ACTIVE);
    byInvitationCode.delete();
    invitationJpaRepository.save(byInvitationCode);
  }
}

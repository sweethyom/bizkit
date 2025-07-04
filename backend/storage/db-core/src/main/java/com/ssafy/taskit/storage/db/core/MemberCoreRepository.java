package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.Member;
import com.ssafy.taskit.domain.MemberRepository;
import com.ssafy.taskit.domain.Role;
import com.ssafy.taskit.domain.error.CoreErrorType;
import com.ssafy.taskit.domain.error.CoreException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class MemberCoreRepository implements MemberRepository {
  private final MemberJpaRepository memberJpaRepository;

  public MemberCoreRepository(MemberJpaRepository memberJpaRepository) {
    this.memberJpaRepository = memberJpaRepository;
  }

  @Override
  public boolean isLeader(Long userId, Long projectId) {
    return memberJpaRepository
        .findByUserIdAndProjectIdAndMemberRoleAndEntityStatus(
            userId, projectId, Role.LEADER, EntityStatus.ACTIVE)
        .isPresent();
  }

  @Override
  public void updateLastAccessedAt(Long userId, Long projectId, LocalDateTime lastAccessedAt) {
    memberJpaRepository.updateLastAccessedAt(userId, projectId, lastAccessedAt);
  }

  @Override
  public boolean isMember(Long userId, Long projectId) {
    return memberJpaRepository.existsByUserIdAndProjectIdAndEntityStatus(
        userId, projectId, EntityStatus.ACTIVE);
  }

  @Override
  public List<Member> findMembers(Long projectId) {
    List<MemberEntity> memberEntities =
        memberJpaRepository.findByProjectIdAndEntityStatus(projectId, EntityStatus.ACTIVE);
    return memberEntities.stream().map(MemberEntity::toMember).toList();
  }

  @Override
  public Member findById(Long memberId) {
    MemberEntity member = memberJpaRepository
        .findById(memberId)
        .orElseThrow(() -> new CoreException(CoreErrorType.MEMBER_NOT_FOUND));
    return member.toMember();
  }

  @Transactional
  @Override
  public void deleteMember(Long memberId) {
    Optional<MemberEntity> optionalEntity =
        memberJpaRepository.findByIdAndEntityStatus(memberId, EntityStatus.ACTIVE);
    if (optionalEntity.isEmpty()) {
      return;
    }

    MemberEntity memberEntity = optionalEntity.get();
    memberEntity.delete();
  }

  @Override
  public Member findByUserIdAndProjectId(Long userId, Long projectId) {
    return memberJpaRepository
        .findByUserIdAndAndProjectIdAndEntityStatus(userId, projectId, EntityStatus.ACTIVE)
        .toMember();
  }

  @Override
  public int countMembers(Long projectId) {
    return memberJpaRepository.countByProjectIdAndEntityStatus(projectId, EntityStatus.ACTIVE);
  }

  @Override
  public Member save(Long userId, Long projectId, Role role, LocalDateTime lastAccessedAt) {
    return memberJpaRepository
        .save(new MemberEntity(userId, projectId, role, lastAccessedAt))
        .toMember();
  }

  @Override
  public Member save(Member member) {
    return memberJpaRepository.save(MemberEntity.from(member)).toMember();
  }
}

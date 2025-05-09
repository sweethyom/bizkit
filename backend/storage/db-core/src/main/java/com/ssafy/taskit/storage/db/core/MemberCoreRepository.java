package com.ssafy.taskit.storage.db.core;

import com.ssafy.taskit.domain.MemberRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class MemberCoreRepository implements MemberRepository {
  private final MemberJpaRepository memberJpaRepository;

  public MemberCoreRepository(MemberJpaRepository memberJpaRepository) {
    this.memberJpaRepository = memberJpaRepository;
  }

  @Override
  public List<Long> findProjectIdsByUserIdOrderByViewedAtDesc(Long userId) {
    return memberJpaRepository.findProjectIdsByUserIdOrderByViewedAtDesc(userId);
  }
}

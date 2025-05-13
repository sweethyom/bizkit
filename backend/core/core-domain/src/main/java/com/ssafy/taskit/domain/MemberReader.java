package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MemberReader {
  private final MemberRepository memberRepository;

  public MemberReader(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }

  public List<Member> findMembers(Long projectId) {
    return memberRepository.findMembers(projectId);
  }

  public Member findMember(Long memberId) {
    return memberRepository.findById(memberId);
  }
}

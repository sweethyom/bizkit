package com.ssafy.taskit.domain;

import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MemberReader {
  private final MemberRepository memberRepository;
  private final InvitationRepository invitationRepository;

  public MemberReader(
      MemberRepository memberRepository, InvitationRepository invitationRepository) {
    this.memberRepository = memberRepository;
    this.invitationRepository = invitationRepository;
  }

  public List<Member> findMembers(Long projectId) {
    return memberRepository.findMembers(projectId);
  }

  public Member findMember(Long memberId) {
    return memberRepository.findById(memberId);
  }

  public List<Invitation> findInvitationMembers(Long projectId) {
    return invitationRepository.findInvitationMembers(projectId);
  }
}

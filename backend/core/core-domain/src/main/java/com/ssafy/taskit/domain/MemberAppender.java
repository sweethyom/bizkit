package com.ssafy.taskit.domain;

import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class MemberAppender {
  private final UserRepository userRepository;
  private final MemberRepository memberRepository;
  private final MemberValidator memberValidator;
  private final InvitationValidator invitationValidator;
  private final InvitationRepository invitationRepository;

  private final EmailService emailService;

  public MemberAppender(
      UserRepository userRepository,
      MemberRepository memberRepository,
      MemberValidator memberValidator,
      InvitationValidator invitationValidator,
      InvitationRepository invitationRepository,
      EmailService emailService) {
    this.userRepository = userRepository;
    this.memberRepository = memberRepository;
    this.memberValidator = memberValidator;
    this.invitationValidator = invitationValidator;
    this.invitationRepository = invitationRepository;
    this.emailService = emailService;
  }

  public Invitation appendInvitation(Long projectId, NewInvitation newInvitation) {

    Long userId = userRepository.findByEmail(newInvitation.email());
    invitationValidator.isInvitationExists(userId);
    memberValidator.isProjectMember(userId, projectId);
    memberValidator.isProjectFull(projectId);

    String invitationCode = UUID.randomUUID().toString();
    Invitation invitation =
        invitationRepository.save(userId, newInvitation, projectId, invitationCode);
    emailService.sendInvitation(newInvitation.email(), invitationCode);
    return invitation;
  }
}

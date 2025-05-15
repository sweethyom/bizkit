package com.ssafy.taskit.domain;

import java.time.LocalDateTime;
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

    User user = userRepository.findByEmail(newInvitation.email());
    invitationValidator.validateInvitationNotExists(user.id());
    memberValidator.validateNotMember(user, projectId);
    memberValidator.isProjectFull(projectId);

    String invitationCode = UUID.randomUUID().toString();
    Invitation invitation =
        invitationRepository.save(user.id(), newInvitation, projectId, invitationCode);
    emailService.sendInvitation(newInvitation.email(), invitationCode);
    return invitation;
  }

  public void appendMember(User user, String invitationCode) {
    Invitation invitation = invitationRepository.findByInvitationCode(invitationCode);
    memberValidator.isProjectFull(invitation.projectId());
    invitationRepository.accept(invitationCode);
    memberRepository.save(user.id(), invitation.projectId(), Role.MEMBER, LocalDateTime.now());
  }

  public void appendLeader(User user, Project project) {
    Member leader = Member.createLeader(user, project);
    memberRepository.save(leader);
  }
}

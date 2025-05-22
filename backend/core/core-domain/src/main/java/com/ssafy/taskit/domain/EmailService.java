package com.ssafy.taskit.domain;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  private final EmailSender emailSender;

  public EmailService(EmailSender emailSender) {
    this.emailSender = emailSender;
  }

  @Async
  public void sendInvitation(String email, String invitationCode) {
    String link = "http://bizkit.co.kr/invitation/" + invitationCode;
    String subject = "프로젝트 초대";
    String text = "아래 링크를 통해 초대를 수락하세요:" + link;
    emailSender.sendEmail(email, subject, text);
  }
}

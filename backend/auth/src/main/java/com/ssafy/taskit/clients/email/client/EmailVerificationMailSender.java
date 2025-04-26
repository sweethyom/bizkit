package com.ssafy.taskit.clients.email.client;

import com.ssafy.taskit.auth.domain.verification.VerificationCode;
import com.ssafy.taskit.auth.domain.verification.VerificationCodeSendClient;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class EmailVerificationMailSender implements VerificationCodeSendClient {

  private static final Logger log = LoggerFactory.getLogger(EmailVerificationMailSender.class);

  private static final String SUBJECT = "[BizKit] 회원 가입을 위해 메일을 인증해 주세요.";

  private final JavaMailSender mailSender;
  private final EmailVerificationCodeHtmlLoader htmlLoader;

  public EmailVerificationMailSender(JavaMailSender mailSender,
      EmailVerificationCodeHtmlLoader htmlLoader) {
    this.mailSender = mailSender;
    this.htmlLoader = htmlLoader;
  }

  @Override
  public void send(VerificationCode code) {
    MimeMessage mimeMessage = mailSender.createMimeMessage();

    MimeMessageHelper helper = null;
    try {
      helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
      helper.setTo(code.getEmail());
      helper.setSubject(SUBJECT);
      helper.setText(htmlLoader.loadWith(code), true);
    } catch (MessagingException e) {
      log.error(e.getMessage(), e);
    }

    mailSender.send(mimeMessage);
  }
}

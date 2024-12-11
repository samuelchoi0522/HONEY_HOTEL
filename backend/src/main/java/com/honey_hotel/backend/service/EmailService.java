package com.honey_hotel.backend.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    public String generatePasswordResetHtmlBody(String resetLink) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "  .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px; }"
                +
                "  .email-header { font-size: 24px; font-weight: bold; text-align: center; color: #4CAF50; }" +
                "  .email-body { font-size: 16px; color: #333333; line-height: 1.5; margin: 20px 0; }" +
                "  .reset-button { display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; border-radius: 5px; text-decoration: none; text-align: center; }"
                +
                "  .footer { font-size: 12px; color: #aaaaaa; text-align: center; margin-top: 20px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='email-container'>" +
                "<div class='email-header'>Honey Hotel - Password Reset</div>" +
                "<div class='email-body'>" +
                "<p>Hello,</p>" +
                "<p>You requested to reset your password. Click the button below to reset it:</p>" +
                "<p><a href='" + resetLink + "' class='reset-button'>Reset Password</a></p>" +
                "<p>If you didn’t request a password reset, please ignore this email.</p>" +
                "</div>" +
                "<div class='footer'>Honey Hotel, All rights reserved.</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}

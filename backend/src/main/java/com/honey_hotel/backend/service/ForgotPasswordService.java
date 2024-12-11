package com.honey_hotel.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.honey_hotel.backend.model.AppUser;
import com.honey_hotel.backend.model.PasswordResetToken;
import com.honey_hotel.backend.repository.PasswordResetTokenRepository;
import com.honey_hotel.backend.repository.UserRepository;

@Service
public class ForgotPasswordService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public ForgotPasswordService(UserRepository userRepository, PasswordResetTokenRepository tokenRepository,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    public boolean sendResetToken(String email) {
        Optional<AppUser> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return false;
        }

        AppUser user = userOpt.get();
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        String subject = "Password Reset Request";
        String body = "Click the following link to reset your password: " + resetLink;

        return emailService.sendEmail(email, subject, body);
    }
}
